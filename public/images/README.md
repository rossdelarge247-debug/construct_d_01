# Component imagery

Static image assets served by Next.js from `public/images/`. Established in slice **S-F1 design tokens**; first consumer will be the welcome-tour slice.

## Convention

One sub-folder per component, slug-named:

```
public/images/
├── README.md                  ← this file
├── {component-slug}/          ← e.g. welcome-tour/, post-connect-dashboard/
│   ├── *.png | *.jpg | *.svg | *.webp
│   └── ...
```

Reference from components with the absolute path: `/images/welcome-tour/intro-hero.png` (Next.js serves `public/` at the site root).

## Rationale

- **Next.js static serving** — files in `public/` are served verbatim, no build step, ideal for designed imagery.
- **Component-scoped folders** — each component's assets travel with the component slice. When a slice ships, drop its assets in its sub-folder.
- **No assets in S-F1** — this slice ships convention only. Image files land with their owning component slice (welcome carousel slice for the welcome-tour assets, etc.).
