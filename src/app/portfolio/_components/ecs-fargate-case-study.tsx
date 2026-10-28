export default function EcsFargateCaseStudy() {
  return (
    <article className="space-y-6 text-sm leading-relaxed break-words text-foreground [&>section+section]:border-t [&>section+section]:border-border/60 [&>section+section]:pt-6">
      <div className="space-y-3 rounded-lg border border-border/60 bg-muted/20 p-4">
        <p className="font-semibold text-muted-foreground">핵심 개선</p>
        <p className="text-[15px] font-medium leading-relaxed">
          ECS 실행 환경을 Fargate로 전환해 EC2 호스트와 배포 시 여유 용량을
          직접 관리하는 부담을 줄였습니다.
        </p>
        <p className="text-[15px] font-medium leading-relaxed">
          필요한 AWS 서비스에 대한 VPC Endpoint를 구성하고, 해당 통신에 사용하던
          NAT Gateway를 제거해 상시 비용이 발생하는 네트워크 경로를 정리했습니다.
        </p>
      </div>

      <section className="space-y-3">
        <h4 className="text-base font-semibold">배경</h4>
        <p>
          초기에는 인프라 비용을 줄이기 위해 AWS 프리티어 EC2 인스턴스에 ECS를
          구성했습니다. 애플리케이션은 Private Subnet에서 실행하고, 외부 서비스에
          접근할 때는 NAT Gateway를 사용했습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h4 className="text-base font-semibold">문제와 고민</h4>
        <h5 className="text-[15px] font-semibold">
          롤링 배포에 필요한 EC2 여유 자원 부족
        </h5>
        <p>
          롤링 배포 과정에서 기존 Task와 신규 Task를 동시에
          실행할 여유 자원이 부족해 배포가 지연되거나 실패하는 문제가 발생했습니다.
        </p>
        <p>
          애플리케이션에 필요한 자원뿐 아니라 EC2의 잔여 용량과 배포 시 추가
          용량까지 함께 관리해야 했습니다. 애플리케이션 개발과 별개로 호스트의
          실행 용량을 확보해야 하는 부담이 있었습니다.
        </p>
        <h5 className="text-[15px] font-semibold">
          트래픽이 적어도 발생하는 NAT Gateway 비용
        </h5>
        <p>
          NAT Gateway는 트래픽이 적은 개발 환경에서도 시간당 요금이
          발생했습니다.
        </p>
        <p>
          애플리케이션의 주요 통신 대상이 AWS 서비스였기 때문에, NAT Gateway를 유지하지 않고도 필요한 통신을 처리할 수 있는지 검토했습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h4 className="text-base font-semibold">해결</h4>
        <h5 className="text-[15px] font-semibold">
          1. Fargate 전환으로 호스트 자원 관리 부담 축소
        </h5>
        <p>
          EC2 인스턴스의 용량을 늘리는 방법도 있었지만, 호스트 자원을 직접 관리해야 하는 부담은 남아 있었습니다.
        </p>
        <p>
          이에 호스트 용량 관리와 애플리케이션 배포를 분리하기 위해 ECS 실행 환경을 Fargate로 전환했습니다.
        </p>
        <p>
          Task별 CPU·메모리를 지정해 실행하도록 구성하면서, 신규 Task를 배치하기 위해 EC2의 잔여 자원을 확인하거나 인스턴스를 증설해야 하는 부담을 줄였습니다.
        </p>
        <h5 className="text-[15px] font-semibold">
          2. VPC Endpoint를 통한 NAT Gateway 제거
        </h5>
        <p>
          애플리케이션의 주요 통신 대상인 S3, Bedrock, Secrets Manager 등 필요한
          AWS 서비스에 VPC Endpoint를 통한 사설 접근 경로를 구성했습니다.
        </p>
        <p>
          Task는 Private Subnet에 유지하면서 필요한 AWS 서비스에 접근하도록 하고,
          해당 통신에 더 이상 필요하지 않은 NAT Gateway를 제거했습니다.
        </p>
        <p>
          RDS와의 통신은 기존처럼 VPC 내부에서 처리하도록 유지했습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h4 className="text-base font-semibold">결과</h4>
        <p>
          EC2 호스트의 잔여 용량과 배포 시 추가 용량을 직접 확보하는 부담을 줄이고, Task 단위로 실행 자원을 관리하도록 변경했습니다.
        </p>
        <p>
          NAT Gateway의 시간당 요금과 데이터 처리 요금이 발생하는 경로를 제거했습니다.
        </p>
        <p>
          필요한 AWS 서비스에 사설 접근 경로를 구성해 해당 통신의 인터넷 아웃바운드 의존성을 줄였습니다.
        </p>
      </section>
    </article>
  );
}
