---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

title: handlery
titleTemplate: Type-save event handling for ALL emitters

hero:
  name: 'handlery'
  text: event handling... like it should be
  tagline: Add class-based, decorator-powered and fully typed event handlers to your [nodejs, emittery, web...] app!
  image:
    src: /handlery-ghost-logo.png
    alt: Themed Logo
  actions:
    - theme: brand
      text: Learn how!
      link: /guide/getting-started
    - theme: alt
      text: Installation
      link: /guide/installation
    - theme: alt
      text: Reference
      link: /reference/handlery

features:
  - title: Type-Safe
    icon: 🔒
    details: All types are inferred from your event emitter and can always be extended!
  - title: Tiny
    icon: 📦
    details: Just a class and some (optional) decorator functions. Super simple
  - title: Feature-rich
    icon: 🚀
    details: Supports all kinds of patterns, automatic unsubscribe, pre-registering, multiple event emitter libraries etc.
---

---

<p align="center" width="100%" style="display: flex; justify-content: center; gap: 16px">
  <a href="https://handlery.dev">
    <img src="https://img.shields.io/badge/Documentation-online-blue" alt="build status">
  </a>
  <a href="https://app.netlify.com/sites/handlery/deploys">
    <img alt="docs deployment" src="https://img.shields.io/netlify/c3cdf58b-607b-46d3-8bb5-ac3d94070850?style=flat&logo=netlify&label=docs">
  </a>
  <a href="https://github.com/janis-me/handlery/deployments">
    <img alt="GitHub deployments" src="https://img.shields.io/github/deployments/janis-me/handlery/prod?logo=github&label=build">
  </a>
  <a href="https://npmjs.com/package/handlery">
    <img alt="handlery on npm" src="https://img.shields.io/npm/v/handlery?label=npm&labelColor=orange&color=grey">
  </a>
</p>

---

`handlery` (like [`emittery`](https://github.com/sindresorhus/emittery) but for 'handle') is a super clean and easy way to handle any kind of events with class-based handlers (and decorators!). It works with all kinds of event emitters (emittery, nodejs' `EventEmitter`...) out of the box! Just look at it:

```ts
@register()
class UserHandler extends EventHandler {
  @on('user.add')
  public handleAddUser(user: Events['user.add'], ctx: HandlerContext) {
    ctx.emitter.emit('user.add.response', { ... })
    // ...
  }
}
```

It requires typescript decorators support (modern, ECMA decorators. Not `Decorators.Legacy` etc.) And an event emitter like [`emittery`](https://github.com/sindresorhus/emittery) or node's built-in [`EventEmitter`](https://nodejs.org/api/events.html).

## Installation

It's on npm!

```bash
npm install handlery
# or
pnpm add handlery
# or
yarn add handlery
```
