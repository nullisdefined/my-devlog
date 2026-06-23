## URLs
- **Blog**: [https://nullisdefined.my](https://nullisdefined.my)
- **RSS Feed**: [https://nullisdefined.my/feed.xml](https://nullisdefined.my/feed.xml)

## Routes

- `/` - Blog home
- `/posts/[...slug]` - Blog post pages
- `/tags/[tags]` - Tag pages
- `/devlog/*` - Legacy blog URLs redirected to the new routes

## Used Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Content**: Markdown (MDX)
- **Deployment**: Vercel
- **CMS**: Obsidian

## Publishing

Posts are written locally in Obsidian and synced into `src/content/posts`.
The public URL structure is handled by the app routes, so Obsidian posts do not need to know about `/posts` or the old `/devlog` path.

```bash
npm run deploy
git status
git add ...
git commit -m "..."
git push
```

`npm run deploy` runs the sync/build preparation flow only. Commit and push are intentionally kept separate.

## Recently

<div style="counter-reset: blog-counter;">

<!-- BLOG:START --><table>
<tr>
<td align="center">📌</td>
<td><strong><a href="https://nullisdefined.my/posts/frameworks/nestjs/nest-factory-create">[NestJS] NestFactory.create&lpar;&rpar;를 두 번 호출하면 MSA일까?</a></strong></td>
</tr>
</table><table>
<tr>
<td align="center">📌</td>
<td><strong><a href="https://nullisdefined.my/posts/etc/uncategorized/2025-sw-talent-festival-review">2025 SW 인재 페스티벌 참여 후기</a></strong></td>
</tr>
</table><table>
<tr>
<td align="center">📌</td>
<td><strong><a href="https://nullisdefined.my/posts/frameworks/nestjs/nestjs-mongodb">[NestJS] MongoDB</a></strong></td>
</tr>
</table><table>
<tr>
<td align="center">📌</td>
<td><strong><a href="https://nullisdefined.my/posts/frameworks/nestjs/nestjs-guards">[NestJS] Guards</a></strong></td>
</tr>
</table><table>
<tr>
<td align="center">📌</td>
<td><strong><a href="https://nullisdefined.my/posts/frameworks/nestjs/nestjs-pipes">[NestJS] Pipes</a></strong></td>
</tr>
</table><!-- BLOG:END -->

</div>

---

<p align="center">
  <a href="https://nullisdefined.my">
    <img src="https://img.shields.io/badge/Read%20More%20Posts-Dev%20Blog-ff6b6b?style=for-the-badge&logo=rss&logoColor=white" alt="More Posts"/>
  </a>
</p>
