---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

title: handlery
titleTemplate: Type-save event handling for ALL emitters

hero:
  name: 'handlery'
  text: Type-save event handling for ALL emitters
  tagline: Add class-based, decorator-powered and fully typed event handlers to your [nodejs, emittery, web...] app!
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

`handlery` (like [`emittery`](https://github.com/sindresorhus/emittery) but for 'handle') is a minimal way to handle events with nice class decorators. It works with all kinds of event emitters (emittery, nodejs' `EventEmitter`...) out of the box! So instead of writing

```ts
function registerUserHandlers() {
  const addListener = emitter.on('user.add', (user: UserAddEvent) => {
    // ...
  });

  return () => {
    addListener.unsubscribe();
  };

  // ...
}

const unsubscribeUsers = registerUserHandlers();
```

you can simply do

```ts
@subscribe()
class UserHandler extends EventHandler {
  @on('user.add')
  public handleAddUser(user: UserAddEvent, ctx: HandlerContext) {
    // ...
  }
}
```
