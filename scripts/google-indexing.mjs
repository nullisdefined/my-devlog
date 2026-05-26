import { createSign } from 'crypto';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const KEY_PATH = resolve(process.cwd(), process.env.GCP_INDEXING_KEY_PATH ?? 'gcp-indexing-key.json');
const keyData = JSON.parse(readFileSync(KEY_PATH, 'utf-8'));
const ENDPOINT = 'https://indexing.googleapis.com/v3/urlNotifications:publish';

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    iss: keyData.client_email,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  })).toString('base64url');

  const sign = createSign('RSA-SHA256');
  sign.update(`${header}.${payload}`);
  const signature = sign.sign(keyData.private_key, 'base64url');
  const jwt = `${header}.${payload}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const data = await res.json();
  if (!data.access_token) throw new Error(`Auth failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

const URLS = [
  'https://nullisdefined.my',
  'https://nullisdefined.my/devlog',
  'https://nullisdefined.my/devlog/posts/backend/nestjs/modularization-refactor',
  'https://nullisdefined.my/devlog/posts/backend/nestjs/nestjs-query-parameter-boolean-transformation-issue',
  'https://nullisdefined.my/devlog/posts/backend/nestjs/nodeflipnest-env-config',
  'https://nullisdefined.my/devlog/posts/backend/nodejs/node-js-is-not-single-threaded',
  'https://nullisdefined.my/devlog/posts/cloud/aws/aws-computing',
  'https://nullisdefined.my/devlog/posts/cloud/aws/aws-database',
  'https://nullisdefined.my/devlog/posts/cloud/aws/aws-introduction',
  'https://nullisdefined.my/devlog/posts/cloud/aws/aws-lambda-destinations',
  'https://nullisdefined.my/devlog/posts/cloud/aws/aws-lambda-invocation-methods',
  'https://nullisdefined.my/devlog/posts/cloud/aws/aws-networking',
  'https://nullisdefined.my/devlog/posts/cloud/aws/aws-storage',
  'https://nullisdefined.my/devlog/posts/cloud/aws/designing-landing-zone-architectures-with-aws-control-tower',
  'https://nullisdefined.my/devlog/posts/cloud/aws/developing-on-aws',
  'https://nullisdefined.my/devlog/posts/cloud/aws/event-object-vs-context-object',
  'https://nullisdefined.my/devlog/posts/cloud/aws/getting-started-with-amazon-ecr',
  'https://nullisdefined.my/devlog/posts/cloud/aws/getting-started-with-amazon-ecs',
  'https://nullisdefined.my/devlog/posts/cloud/aws/getting-started-with-amazon-eks-anywhere',
  'https://nullisdefined.my/devlog/posts/cloud/aws/introduction-to-aws-database-migration-service',
  'https://nullisdefined.my/devlog/posts/cloud/aws/introduction-to-aws-lambda',
  'https://nullisdefined.my/devlog/posts/cloud/aws/introduction-to-database-migration',
  'https://nullisdefined.my/devlog/posts/cloud/aws/working-with-amazon-elastic-container-service',
  'https://nullisdefined.my/devlog/posts/cs/data-structure/big-o-notation',
  'https://nullisdefined.my/devlog/posts/cs/data-structure/js-object-vs-array',
  'https://nullisdefined.my/devlog/posts/cs/database/database',
  'https://nullisdefined.my/devlog/posts/cs/database/database-design',
  'https://nullisdefined.my/devlog/posts/cs/database/db-atomicity',
  'https://nullisdefined.my/devlog/posts/cs/database/db-consistency',
  'https://nullisdefined.my/devlog/posts/cs/database/db-durability',
  'https://nullisdefined.my/devlog/posts/cs/database/db-isolation',
  'https://nullisdefined.my/devlog/posts/cs/database/relational-data-model',
  'https://nullisdefined.my/devlog/posts/cs/database/relational-database-design',
  'https://nullisdefined.my/devlog/posts/cs/database/sql1',
  'https://nullisdefined.my/devlog/posts/cs/database/sql2',
  'https://nullisdefined.my/devlog/posts/cs/network-programming/address-resolution-protocol',
  'https://nullisdefined.my/devlog/posts/cs/network-programming/connection-oriented-tcp',
  'https://nullisdefined.my/devlog/posts/cs/network-programming/delivery-and-forwarding-of-ip-packets',
  'https://nullisdefined.my/devlog/posts/cs/network-programming/internet-control-message-protocol-version-4',
  'https://nullisdefined.my/devlog/posts/cs/network-programming/ipv4',
  'https://nullisdefined.my/devlog/posts/cs/network-programming/network-layer',
  'https://nullisdefined.my/devlog/posts/cs/network-programming/sip-rtp-volte',
  'https://nullisdefined.my/devlog/posts/cs/network-programming/tcp-flow-congestion-error-control',
  'https://nullisdefined.my/devlog/posts/cs/network-programming/tcp-segment',
  'https://nullisdefined.my/devlog/posts/cs/network-programming/unicast-routing-protocol-rip-ospf-bgp',
  'https://nullisdefined.my/devlog/posts/cs/network-programming/user-datagram-protocol',
  'https://nullisdefined.my/devlog/posts/cs/system-programming/concurrency',
  'https://nullisdefined.my/devlog/posts/cs/system-programming/inputoutput',
  'https://nullisdefined.my/devlog/posts/cs/system-programming/kernel-user-mode-and-kernel-mode',
  'https://nullisdefined.my/devlog/posts/cs/system-programming/linking',
  'https://nullisdefined.my/devlog/posts/cs/system-programming/linux-process',
  'https://nullisdefined.my/devlog/posts/cs/system-programming/memory-representation',
  'https://nullisdefined.my/devlog/posts/cs/system-programming/memory-sharing',
  'https://nullisdefined.my/devlog/posts/cs/system-programming/pipe',
  'https://nullisdefined.my/devlog/posts/cs/system-programming/posix-c',
  'https://nullisdefined.my/devlog/posts/cs/system-programming/signal',
  'https://nullisdefined.my/devlog/posts/cs/system-programming/stack-frame',
  'https://nullisdefined.my/devlog/posts/cs/system-programming/unix-shell',
  'https://nullisdefined.my/devlog/posts/cs/system-programming/virtual-memory-memory-mapping',
  'https://nullisdefined.my/devlog/posts/etc/uncategorized/2025-sw-talent-festival-review',
  'https://nullisdefined.my/devlog/posts/etc/uncategorized/5-linux-command-tricks-that-will-chang-your-life-as-a-programmer',
  'https://nullisdefined.my/devlog/posts/etc/uncategorized/github-ssh',
  'https://nullisdefined.my/devlog/posts/frameworks/nestjs/modularization-refactor',
  'https://nullisdefined.my/devlog/posts/frameworks/nestjs/nestjs-controllers',
  'https://nullisdefined.my/devlog/posts/frameworks/nestjs/nestjs-decorator',
  'https://nullisdefined.my/devlog/posts/frameworks/nestjs/nestjs-exception-filters',
  'https://nullisdefined.my/devlog/posts/frameworks/nestjs/nestjs-first-steps',
  'https://nullisdefined.my/devlog/posts/frameworks/nestjs/nestjs-guards',
  'https://nullisdefined.my/devlog/posts/frameworks/nestjs/nestjs-http-request-and-response',
  'https://nullisdefined.my/devlog/posts/frameworks/nestjs/nestjs-introduction',
  'https://nullisdefined.my/devlog/posts/frameworks/nestjs/nestjs-middleware',
  'https://nullisdefined.my/devlog/posts/frameworks/nestjs/nestjs-modules',
  'https://nullisdefined.my/devlog/posts/frameworks/nestjs/nestjs-mongodb',
  'https://nullisdefined.my/devlog/posts/frameworks/nestjs/nestjs-pipes',
  'https://nullisdefined.my/devlog/posts/frameworks/nestjs/nestjs-providers',
  'https://nullisdefined.my/devlog/posts/frameworks/nestjs/nestjs-transaction',
  'https://nullisdefined.my/devlog/posts/frameworks/nestjs/nestjs-validation-pipe',
  'https://nullisdefined.my/devlog/posts/frameworks/nestjs/nodeflipnest-env-config',
  'https://nullisdefined.my/devlog/posts/frameworks/nodejs/express-middleware-and-routing',
  'https://nullisdefined.my/devlog/posts/frameworks/nodejs/graphql',
  'https://nullisdefined.my/devlog/posts/frameworks/nodejs/nodej-module-system',
  'https://nullisdefined.my/devlog/posts/frameworks/nodejs/nodejs-event-driven-architecture-and-non-blocking',
  'https://nullisdefined.my/devlog/posts/frameworks/nodejs/nodejs-express',
  'https://nullisdefined.my/devlog/posts/languages/javascript/es15-ecmascript-2025',
  'https://nullisdefined.my/devlog/posts/languages/javascript/javascript-vs-typescript',
  'https://nullisdefined.my/devlog/posts/languages/javascript/js-promise',
  'https://nullisdefined.my/devlog/posts/languages/typescript/10-bad-typescript-habits-to-break-in-2024',
  'https://nullisdefined.my/devlog/posts/languages/typescript/start-typescript',
  'https://nullisdefined.my/devlog/posts/languages/typescript/ts-class',
  'https://nullisdefined.my/devlog/posts/languages/typescript/ts-function',
  'https://nullisdefined.my/devlog/posts/languages/typescript/ts-interface',
  'https://nullisdefined.my/devlog/posts/languages/typescript/ts-type-system',
  'https://nullisdefined.my/devlog/posts/series/devlog/changing-slug',
  'https://nullisdefined.my/devlog/posts/series/devlog/duplication-post-issue',
  'https://nullisdefined.my/devlog/posts/series/devlog/first-devlog-post',
  'https://nullisdefined.my/devlog/posts/series/devlog/image-modal-implementation',
  'https://nullisdefined.my/devlog/posts/series/devlog/implement-dynamic-gradient-banner-for-using-canvas-api',
  'https://nullisdefined.my/devlog/posts/series/devlog/nextjs-13-metadata-api',
  'https://nullisdefined.my/devlog/posts/series/devlog/obsidian-posting-system',
  'https://nullisdefined.my/devlog/posts/series/devlog/optimizing-seo',
  'https://nullisdefined.my/devlog/posts/series/devlog/rss-feed-implementation',
  'https://nullisdefined.my/devlog/posts/series/devlog/sitemap-script',
  'https://nullisdefined.my/devlog/posts/series/devlog/upstash-redis-chat',
  'https://nullisdefined.my/devlog/posts/series/devlog/vanilla-js-scroll-animation-implementation',
  'https://nullisdefined.my/devlog/posts/series/devlog/view-mode-system',
  'https://nullisdefined.my/devlog/posts/series/git-clone/blob-object-implementation',
  'https://nullisdefined.my/devlog/posts/series/git-clone/commit-object-implementation',
  'https://nullisdefined.my/devlog/posts/series/git-clone/git-cli-init-add-commit-command',
  'https://nullisdefined.my/devlog/posts/series/git-clone/git-core-objects-test',
  'https://nullisdefined.my/devlog/posts/series/git-clone/tree-object-implementation',
  'https://nullisdefined.my/devlog/posts/series/toy-project/guestbook-serverless-architecture',
  'https://nullisdefined.my/devlog/posts/series/toy-project/halsaram-project-planning',
  'https://nullisdefined.my/devlog/posts/series/toy-project/korean-nickname-random-generator',
  'https://nullisdefined.my/devlog/posts/series/toy-project/thumbs-up-customizing-background',
  'https://nullisdefined.my/devlog/posts/series/toy-project/thumbs-up-customizing-typography',
  'https://nullisdefined.my/devlog/posts/series/toy-project/thumbs-up-image-download-and-copy-clipboard',
  'https://nullisdefined.my/devlog/posts/series/toy-project/thumbs-up-v1-0',
  'https://nullisdefined.my/devlog/posts/tools/git/git-blob-tree-commit-object',
  'https://nullisdefined.my/devlog/posts/tools/git/git-branch',
  'https://nullisdefined.my/devlog/posts/tools/git/git-staging-area',
];

async function main() {
  const token = await getAccessToken();
  console.log('Auth OK, starting indexing requests...\n');

  let success = 0;
  let failed = 0;

  for (let i = 0; i < URLS.length; i++) {
    const url = URLS[i];
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ url, type: 'URL_UPDATED' }),
      });

      const data = await res.json();
      if (res.ok) {
        success++;
        console.log(`[${i + 1}/${URLS.length}] OK: ${url}`);
      } else {
        failed++;
        console.log(`[${i + 1}/${URLS.length}] FAIL: ${url} - ${data.error?.message || res.status}`);
      }
    } catch (err) {
      failed++;
      console.log(`[${i + 1}/${URLS.length}] FAIL: ${url} - ${err.message}`);
    }

    if (i < URLS.length - 1) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  console.log(`\nDone! Success: ${success}, Failed: ${failed}, Total: ${URLS.length}`);
}

main().catch(console.error);
