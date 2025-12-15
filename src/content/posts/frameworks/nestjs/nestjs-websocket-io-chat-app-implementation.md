---
title: "[NestJS] WebSocket.IO로 실시간 채팅 구현하기"
slug: "nestjs-websocket-io-chat-app-implementation"
date: 2025-06-22
tags: ["NestJS", "WebSocket", "Chat"]
category: "Frameworks/NestJS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/ba327d8bd752b28da5ef9d9bcc7670e0.png"
draft: true
views: 0
---
SOAPFT 프로젝트에서 NestJS와 Socket.IO를 사용하여 실시간 채팅 시스템을 구현을 맡았다. 특히 iOS 앱과의 연동을 고려한 설계로, REST API와 WebSocket을 모두 지원하는 하이브리드 구조를 채택했습니다.

- 1대1 채팅 / 그룹 채팅 / 챌린지 채팅 지원

- 실시간 메시지 송수신 (Socket.IO)

- REST API 기반 채팅방 관리

- JWT 토큰 기반 인증

- 읽음 처리 및 읽지 않은 메시지 수

- 타이핑 상태 알림

- 친구 관계 확인 로직

- PostgreSQL 기반 데이터 저장

아키텍처 설계
1. 데이터베이스 엔티티

```ts title:ChatRoomEntity
@Entity('chat_rooms')
export class ChatRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  roomUuid: string;

  @Column({
    type: 'enum',
    enum: ChatRoomType,
  })
  type: ChatRoomType; // DIRECT, GROUP, CHALLENGE

  @Column()
  name: string;

  @Column('text', { array: true })
  participantUuids: string[]; // PostgreSQL 배열 타입

  @Column({ nullable: true })
  challengeUuid: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastMessageAt: Date;
}
```

모듈 구조

```
src/modules/chat/
├── chat.controller.ts    # REST API 엔드포인트
├── chat.gateway.ts       # WebSocket 게이트웨이
├── chat.service.ts       # 비즈니스 로직
├── chat.module.ts        # 모듈 설정
└── dto/                  # 데이터 전송 객체
    ├── create-chat-room.dto.ts
    ├── send-message.dto.ts
    ├── get-chat-rooms.dto.ts
    └── get-messages.dto.ts
```

ChatService

```ts
async createChatRoom(userUuid: string, createChatRoomDto: CreateChatRoomDto) {
  const { type, name, participantUuids, challengeUuid } = createChatRoomDto;

  // 친구 관계 확인 (1대1 채팅의 경우)
  if (type === ChatRoomType.DIRECT) {
    const otherUserUuid = participantUuids.find(uuid => uuid !== userUuid);
    const friendship = await this.friendshipRepository.findOne({
      where: [
        { requesterUuid: userUuid, addresseeUuid: otherUserUuid, status: FriendshipStatus.ACCEPTED },
        { requesterUuid: otherUserUuid, addresseeUuid: userUuid, status: FriendshipStatus.ACCEPTED }
      ]
    });

    if (!friendship) {
      throw new ForbiddenException('친구가 아닌 사용자와는 채팅할 수 없습니다.');
    }
  }

  // 채팅방 생성
  const chatRoom = this.chatRoomRepository.create({
    roomUuid: ulid(),
    type,
    name: name || await this.generateRoomName(participantUuids, userUuid),
    participantUuids,
    challengeUuid,
  });

  return await this.chatRoomRepository.save(chatRoom);
}
```

메시지 전송

```ts
async sendMessage(userUuid: string, roomUuid: string, sendMessageDto: SendMessageDto) {
  // 채팅방 권한 확인
  const chatRoom = await this.chatRoomRepository.findOne({
    where: { roomUuid, isActive: true }
  });

  if (!chatRoom?.participantUuids.includes(userUuid)) {
    throw new ForbiddenException('채팅방에 참여하지 않은 사용자입니다.');
  }

  // 메시지 저장
  const message = this.chatMessageRepository.create({
    roomUuid,
    senderUuid: userUuid,
    type: sendMessageDto.type,
    content: sendMessageDto.content,
    imageUrl: sendMessageDto.imageUrl,
    isRead: chatRoom.type === ChatRoomType.DIRECT ? false : true,
    readByUuids: chatRoom.type === ChatRoomType.GROUP ? [userUuid] : [],
  });

  const savedMessage = await this.chatMessageRepository.save(message);

  // 채팅방 마지막 메시지 시간 업데이트
  chatRoom.lastMessageAt = new Date();
  await this.chatRoomRepository.save(chatRoom);

  return await this.formatMessageResponse(savedMessage, userUuid);
}
```

ChatGateway - websocket 처리

연결 및 인증

```ts
@WebSocketGateway({
  cors: {
    origin: '*', // iOS 앱에서 접근할 수 있도록 설정
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  async handleConnection(client: AuthenticatedSocket) {
    try {
      // JWT 토큰 검증
      const token = client.handshake.auth?.token || 
                   client.handshake.headers?.authorization?.replace('Bearer ', '');

      const payload = this.jwtService.verify(token);
      client.userUuid = payload.userUuid;
      client.nickname = payload.nickname;

      // 사용자의 채팅방들에 자동 join
      await this.joinUserChatRooms(client);

      client.emit('connected', {
        message: '채팅 서버에 연결되었습니다.',
        userUuid: client.userUuid,
      });
    } catch (error) {
      client.disconnect();
    }
  }
}
```

실시간 메시지 처리

```ts
@SubscribeMessage('sendMessage')
async handleSendMessage(
  @MessageBody() data: { roomUuid: string; message: SendMessageDto },
  @ConnectedSocket() client: AuthenticatedSocket,
) {
  const { roomUuid, message } = data;

  // 메시지 저장
  const savedMessage = await this.chatService.sendMessage(
    client.userUuid,
    roomUuid,
    message,
  );

  // 나를 제외한 채팅방의 다른 참여자들에게만 메시지 전송
  client.to(roomUuid).emit('newMessage', savedMessage);
}
```

여기서 나를 제외하지 않으면 소켓에 연결된 모든 참여자에게 메시지를 보내게 되어 내가 보낸 메시지가 나에게 도착한다

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/ba327d8bd752b28da5ef9d9bcc7670e0.png" alt="image" width="600" />

REST API 엔드포인트

```ts
@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {

  @Post('rooms')
  @ApiCreateChatRoom()
  async createChatRoom(
    @UserUuid() userUuid: string,
    @Body() createChatRoomDto: CreateChatRoomDto,
  ) {
    return await this.chatService.createChatRoom(userUuid, createChatRoomDto);
  }

  @Get('rooms')
  @ApiGetChatRooms()
  async getChatRooms(
    @UserUuid() userUuid: string,
    @Query() getChatRoomsDto: GetChatRoomsDto,
  ) {
    return await this.chatService.getChatRooms(userUuid, getChatRoomsDto);
  }

  @Post('rooms/:roomUuid/messages')
  @ApiSendMessage()
  async sendMessage(
    @UserUuid() userUuid: string,
    @Param('roomUuid') roomUuid: string,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    return await this.chatService.sendMessage(userUuid, roomUuid, sendMessageDto);
  }
}
```

- REST API: 채팅방 목록, 메시지 히스토리 조회

- WebSocket: 실시간 메시지 송수신, 타이핑 상태

연결 상태 관리

```ts
// 사용자의 모든 채팅방에 자동 join
private async joinUserChatRooms(client: AuthenticatedSocket) {
  const chatRooms = await this.chatService.getChatRooms(client.userUuid, {});

  for (const room of chatRooms.rooms) {
    await client.join(room.roomUuid);
  }
}
```

에러 처리 및 재연결

```ts
socket.on('connect_error', (error) => {
  console.error('연결 에러:', error);
  // iOS에서 재연결 로직 구현
});

socket.on('disconnect', () => {
  // 자동 재연결 시도
});
```

테스트 환경은 이렇게 만들었다

실시간 채팅 기능을 테스트할 수 있는 정적 페이지를 열고

```html
<!-- WebSocket 연결 -->
<script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>
<script>
const socket = io('http://localhost:7777/chat', {
  auth: { token: jwtToken },
  extraHeaders: { Authorization: `Bearer ${jwtToken}` }
});
</script>
```

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SOAPFT Chat Test</title>
    <script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
        }
        .messages {
            height: 300px;
            overflow-y: auto;
            border: 1px solid #ddd;
            padding: 10px;
            margin-bottom: 10px;
            background-color: #f9f9f9;
        }
        .message {
            margin-bottom: 10px;
            padding: 8px;
            border-radius: 4px;
            background-color: white;
        }
        .message.my-message {
            background-color: #007bff;
            color: white;
            margin-left: 50px;
        }
        .message.other-message {
            background-color: #e9ecef;
            margin-right: 50px;
        }
        .message.system-message {
            background-color: #ffc107;
            text-align: center;
            font-style: italic;
        }
        input, button {
            padding: 8px;
            margin: 5px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        button {
            background-color: #007bff;
            color: white;
            cursor: pointer;
        }
        button:hover {
            background-color: #0056b3;
        }
        .status {
            padding: 10px;
            margin: 10px 0;
            border-radius: 4px;
        }
        .status.connected {
            background-color: #d4edda;
            color: #155724;
        }
        .status.disconnected {
            background-color: #f8d7da;
            color: #721c24;
        }
        .typing {
            font-style: italic;
            color: #666;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <h1>SOAPFT 채팅 테스트</h1>

    <!-- 연결 설정 -->
    <div class="container">
        <h3>연결 설정</h3>
        <input type="text" id="serverUrl" value="http://localhost:7777" placeholder="서버 URL">
        <input type="text" id="jwtToken" placeholder="JWT 토큰 입력" style="width: 300px;">
        <button onclick="connect()">연결</button>
        <button onclick="disconnect()">연결 해제</button>
        <div id="connectionStatus" class="status disconnected">연결되지 않음</div>
    </div>

    <!-- 채팅방 관리 -->
    <div class="container">
        <h3>채팅방 관리</h3>
        <input type="text" id="roomUuid" placeholder="채팅방 UUID" style="width: 300px;">
        <button onclick="joinRoom()">채팅방 입장</button>
        <button onclick="leaveRoom()">채팅방 나가기</button>
        <button onclick="markAsRead()">읽음 처리</button>
    </div>

    <!-- 메시지 -->
    <div class="container">
        <h3>채팅</h3>
        <div id="messages" class="messages"></div>
        <div id="typing" class="typing"></div>
        <div>
            <input type="text" id="messageInput" placeholder="메시지 입력" style="width: 400px;" onkeypress="handleKeyPress(event)">
            <button onclick="sendMessage()">전송</button>
            <button onclick="startTyping()">타이핑 시작</button>
            <button onclick="stopTyping()">타이핑 중지</button>
        </div>
    </div>

    <!-- 로그 -->
    <div class="container">
        <h3>로그</h3>
        <div id="logs" style="height: 200px; overflow-y: auto; background-color: #f8f9fa; padding: 10px; font-family: monospace; font-size: 12px;"></div>
        <button onclick="clearLogs()">로그 지우기</button>
    </div>

    <script>
        let socket = null;
        let currentRoomUuid = null;
        let isTyping = false;

        // 전역 에러 핸들러
        window.addEventListener('error', function(event) {
            console.error('전역 에러:', event.error);
            log(`전역 에러: ${event.error?.message || event.message}`);
            event.preventDefault(); // 페이지 새로고침 방지
        });

        window.addEventListener('unhandledrejection', function(event) {
            console.error('처리되지 않은 Promise 에러:', event.reason);
            log(`Promise 에러: ${event.reason?.message || event.reason}`);
            event.preventDefault(); // 페이지 새로고침 방지
        });

        function log(message) {
            const logs = document.getElementById('logs');
            const timestamp = new Date().toLocaleTimeString();
            logs.innerHTML += `[${timestamp}] ${message}<br>`;
            logs.scrollTop = logs.scrollHeight;
        }

        function connect() {
            try {
                const serverUrl = document.getElementById('serverUrl').value.trim();
                const jwtToken = document.getElementById('jwtToken').value.trim();

                console.log('연결 시도');
                console.log('서버 URL:', serverUrl);
                console.log('JWT 토큰 길이:', jwtToken.length);

                if (!jwtToken) {
                    alert('JWT 토큰을 입력해주세요.');
                    return;
                }

                // 기존 연결이 있으면 해제
                if (socket) {
                    socket.disconnect();
                }

                log(`WebSocket 연결 시도: ${serverUrl}/chat`);

                socket = io(`${serverUrl}/chat`, {
                    auth: {
                        token: jwtToken
                    },
                    extraHeaders: {
                        Authorization: `Bearer ${jwtToken}`
                    },
                    timeout: 10000, // 10초 타임아웃
                    transports: ['websocket', 'polling'] // 전송 방식 명시
                });
            } catch (error) {
                console.error('연결 중 에러:', error);
                log(`연결 에러: ${error.message}`);
                alert(`연결 실패: ${error.message}`);
            }

            socket.on('connect', () => {
                document.getElementById('connectionStatus').textContent = '연결됨';
                document.getElementById('connectionStatus').className = 'status connected';
                log('WebSocket 연결 성공');
            });

            socket.on('disconnect', () => {
                document.getElementById('connectionStatus').textContent = '연결 해제됨';
                document.getElementById('connectionStatus').className = 'status disconnected';
                log('WebSocket 연결 해제');
            });

            socket.on('connect_error', (error) => {
                console.error('연결 에러:', error);
                log(`연결 에러: ${error.message}`);
                document.getElementById('connectionStatus').textContent = `연결 실패: ${error.message}`;
                document.getElementById('connectionStatus').className = 'status disconnected';
            });

            socket.on('error', (error) => {
                console.error('Socket 에러:', error);
                log(`Socket 에러: ${JSON.stringify(error)}`);
            });

            socket.on('connected', (data) => {
                log(`서버 연결 확인: ${JSON.stringify(data)}`);
            });

            socket.on('newMessage', (data) => {
                addMessage(data, false);
                log(`새 메시지 수신: ${JSON.stringify(data)}`);
            });

            socket.on('joinedRoom', (data) => {
                currentRoomUuid = data.roomUuid;
                log(`채팅방 입장 성공: ${data.roomUuid}`);
            });

            socket.on('leftRoom', (data) => {
                log(`채팅방 나가기 성공: ${data.roomUuid}`);
            });

            socket.on('messagesRead', (data) => {
                log(`메시지 읽음 처리: ${JSON.stringify(data)}`);
            });

            socket.on('userTyping', (data) => {
                if (data.isTyping) {
                    document.getElementById('typing').textContent = `${data.nickname}님이 입력 중...`;
                } else {
                    document.getElementById('typing').textContent = '';
                }
                log(`타이핑 상태: ${JSON.stringify(data)}`);
            });

            socket.on('systemMessage', (data) => {
                addSystemMessage(data.message);
                log(`시스템 메시지: ${JSON.stringify(data)}`);
            });

            socket.on('notification', (data) => {
                log(`알림: ${JSON.stringify(data)}`);
            });

            socket.on('error', (data) => {
                log(`에러: ${JSON.stringify(data)}`);
                alert(`에러: ${data.message}`);
            });
        }

        function disconnect() {
            if (socket) {
                socket.disconnect();
                socket = null;
            }
        }

        function joinRoom() {
            const roomUuid = document.getElementById('roomUuid').value.trim();

            console.log('joinRoom 호출됨');
            console.log('socket 상태:', socket ? '연결됨' : '연결안됨');
            console.log('roomUuid:', roomUuid);

            if (!socket) {
                alert('먼저 WebSocket에 연결해주세요.');
                return;
            }

            if (!roomUuid) {
                alert('채팅방 UUID를 입력해주세요.');
                return;
            }

            socket.emit('joinRoom', { roomUuid });
            document.getElementById('messages').innerHTML = '';
            log(`채팅방 입장 시도: ${roomUuid}`);
        }

        function leaveRoom() {
            const roomUuid = document.getElementById('roomUuid').value;
            if (!socket || !roomUuid) {
                alert('소켓 연결과 채팅방 UUID가 필요합니다.');
                return;
            }

            socket.emit('leaveRoom', { roomUuid });
            currentRoomUuid = null;
        }

        function sendMessage() {
            const messageInput = document.getElementById('messageInput');
            const roomUuid = document.getElementById('roomUuid').value;

            if (!socket || !roomUuid || !messageInput.value.trim()) {
                alert('소켓 연결, 채팅방 UUID, 메시지 내용이 필요합니다.');
                return;
            }

            const messageData = {
                roomUuid,
                message: {
                    type: 'TEXT',
                    content: messageInput.value.trim()
                }
            };

            socket.emit('sendMessage', messageData);
            addMessage({
                content: messageInput.value.trim(),
                isMyMessage: true,
                createdAt: new Date().toISOString()
            }, true);

            messageInput.value = '';
            stopTyping();
        }

        function markAsRead() {
            const roomUuid = document.getElementById('roomUuid').value;
            if (!socket || !roomUuid) {
                alert('소켓 연결과 채팅방 UUID가 필요합니다.');
                return;
            }

            socket.emit('markAsRead', { roomUuid });
        }

        function startTyping() {
            const roomUuid = document.getElementById('roomUuid').value;
            if (!socket || !roomUuid || isTyping) {
                return;
            }

            isTyping = true;
            socket.emit('typing', { roomUuid, isTyping: true });
        }

        function stopTyping() {
            const roomUuid = document.getElementById('roomUuid').value;
            if (!socket || !roomUuid || !isTyping) {
                return;
            }

            isTyping = false;
            socket.emit('typing', { roomUuid, isTyping: false });
        }

        function handleKeyPress(event) {
            if (event.key === 'Enter') {
                sendMessage();
            } else if (!isTyping) {
                startTyping();
                // 3초 후 자동으로 타이핑 중지
                setTimeout(() => {
                    if (isTyping) stopTyping();
                }, 3000);
            }
        }

        function addMessage(data, isMyMessage) {
            const messages = document.getElementById('messages');
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${isMyMessage ? 'my-message' : 'other-message'}`;

            const time = new Date(data.createdAt).toLocaleTimeString();
            const sender = data.sender ? data.sender.nickname : '나';

            messageDiv.innerHTML = `
                <strong>${isMyMessage ? '나' : sender}</strong>
                <div>${data.content}</div>
                <small>${time}</small>
            `;

            messages.appendChild(messageDiv);
            messages.scrollTop = messages.scrollHeight;
        }

        function addSystemMessage(message) {
            const messages = document.getElementById('messages');
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message system-message';
            messageDiv.textContent = message;

            messages.appendChild(messageDiv);
            messages.scrollTop = messages.scrollHeight;
        }

        function clearLogs() {
            document.getElementById('logs').innerHTML = '';
        }

        // 페이지 로드 시 기본값 설정
        window.onload = function() {
            log('채팅 테스트 페이지 로드됨');
        };
    </script>
</body>
</html> 
```

postman 컬렉션도 만들었다

자동 jwt 토큰 관리(환경변수)
변수 자동 저장
에러 응답 처리

```json
{
	"info": {
		"_postman_id": "chat-api-test",
		"name": "SOAPFT Chat API",
		"description": "SOAPFT Chat API Test Collection",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
	},
	"variable": [
		{
			"key": "baseUrl",
			"value": "http://localhost:7777",
			"type": "string"
		},
		{
			"key": "jwtToken",
			"value": "",
			"type": "string"
		},
		{
			"key": "roomUuid",
			"value": "",
			"type": "string"
		}
	],
	"auth": {
		"type": "bearer",
		"bearer": [
			{
				"key": "token",
				"value": "{{jwtToken}}",
				"type": "string"
			}
		]
	},
	"item": [
		{
			"name": "1. 개발용 토큰 발급",
			"event": [
				{
					"listen": "test",
					"script": {
						"exec": [
							"if (pm.response.code === 200 || pm.response.code === 201) {",
							"    const response = pm.response.json();",
							"    pm.collectionVariables.set('jwtToken', response.accessToken);",
							"    console.log('JWT 토큰 저장됨:', response.accessToken);",
							"} else {",
							"    console.log('토큰 발급 실패, 응답 코드:', pm.response.code);",
							"    console.log('응답 내용:', pm.response.text());",
							"}"
						],
						"type": "text/javascript"
					}
				}
			],
			"request": {
				"auth": {
					"type": "noauth"
				},
				"method": "POST",
				"header": [
					{
						"key": "Content-Type",
						"value": "application/json"
					}
				],
				"body": {
					"mode": "raw",
					"raw": "{\n  \"userUuid\": \"01HZQK5J8X2M3N4P5Q6R7S8T9U\"\n}"
				},
				"url": {
					"raw": "{{baseUrl}}/api/auth/dev-token",
					"host": ["{{baseUrl}}"],
					"path": ["api", "auth", "dev-token"]
				}
			}
		},
		{
			"name": "2. 채팅방 생성",
			"event": [
				{
					"listen": "test",
					"script": {
						"exec": [
							"if (pm.response.code === 201) {",
							"    const response = pm.response.json();",
							"    pm.collectionVariables.set('roomUuid', response.roomUuid);",
							"    console.log('채팅방 UUID 저장됨:', response.roomUuid);",
							"}"
						],
						"type": "text/javascript"
					}
				}
			],
			"request": {
				"method": "POST",
				"header": [
					{
						"key": "Content-Type",
						"value": "application/json"
					}
				],
				"body": {
					"mode": "raw",
					"raw": "{\n  \"type\": \"GROUP\",\n  \"participantUuids\": [\"01HZQK5J8X2M3N4P5Q6R7S8T9V\"],\n  \"name\": \"테스트 채팅방\"\n}"
				},
				"url": {
					"raw": "{{baseUrl}}/api/chat/room",
					"host": ["{{baseUrl}}"],
					"path": ["api", "chat", "room"]
				}
			}
		},
		{
			"name": "3. 채팅방 목록 조회",
			"request": {
				"method": "GET",
				"header": [],
				"url": {
					"raw": "{{baseUrl}}/api/chat/rooms?page=1&limit=20",
					"host": ["{{baseUrl}}"],
					"path": ["api", "chat", "rooms"],
					"query": [
						{
							"key": "page",
							"value": "1"
						},
						{
							"key": "limit",
							"value": "20"
						}
					]
				}
			}
		},
		{
			"name": "4. 특정 채팅방 조회",
			"request": {
				"method": "GET",
				"header": [],
				"url": {
					"raw": "{{baseUrl}}/api/chat/room/{{roomUuid}}",
					"host": ["{{baseUrl}}"],
					"path": ["api", "chat", "room", "{{roomUuid}}"]
				}
			}
		},
		{
			"name": "5. 메시지 전송",
			"request": {
				"method": "POST",
				"header": [
					{
						"key": "Content-Type",
						"value": "application/json"
					}
				],
				"body": {
					"mode": "raw",
					"raw": "{\n  \"type\": \"TEXT\",\n  \"content\": \"안녕하세요! 테스트 메시지입니다.\"\n}"
				},
				"url": {
					"raw": "{{baseUrl}}/api/chat/room/{{roomUuid}}/message",
					"host": ["{{baseUrl}}"],
					"path": ["api", "chat", "room", "{{roomUuid}}", "message"]
				}
			}
		},
		{
			"name": "6. 메시지 목록 조회",
			"request": {
				"method": "GET",
				"header": [],
				"url": {
					"raw": "{{baseUrl}}/api/chat/room/{{roomUuid}}/messages?page=1&limit=50",
					"host": ["{{baseUrl}}"],
					"path": ["api", "chat", "room", "{{roomUuid}}", "messages"],
					"query": [
						{
							"key": "page",
							"value": "1"
						},
						{
							"key": "limit",
							"value": "50"
						}
					]
				}
			}
		},
		{
			"name": "7. 메시지 읽음 처리",
			"request": {
				"method": "PATCH",
				"header": [],
				"url": {
					"raw": "{{baseUrl}}/api/chat/room/{{roomUuid}}/read",
					"host": ["{{baseUrl}}"],
					"path": ["api", "chat", "room", "{{roomUuid}}", "read"]
				}
			}
		},
		{
			"name": "8. 채팅방 나가기",
			"request": {
				"method": "DELETE",
				"header": [],
				"url": {
					"raw": "{{baseUrl}}/api/chat/room/{{roomUuid}}/leave",
					"host": ["{{baseUrl}}"],
					"path": ["api", "chat", "room", "{{roomUuid}}", "leave"]
				}
			}
		}
	]
} 
```

NestJS와 Socket.IO를 활용하여 확장 가능하고 안정적인 실시간 채팅 시스템을 구현했다. iOS 앱과의 원활한 연동을 위한 API를 설계했다 PostgreSQL의 배열 타입을 활용한 참여자 관리와 JWT 기반 실시간 인증으로 구현