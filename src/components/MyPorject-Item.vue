<template>
  <div  id="item" class="item">
    <i id="icons">
      <slot name="icon"></slot>
    </i>
    <div class="details">
      <h3>
        <slot name="heading"></slot>
      </h3>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.item {
  margin-top: 2rem;
  display: flex;
  position: relative;
}

.details {
  flex: 1;
  margin-left: 1rem;
  font-size: 0.85rem;
}

#icons {
  display: flex;
  place-items: center;
  place-content: center;
  width: 32px;
  height: 32px;
  color: var(--color-text-link-1);
}
.dark #icons{
  border-color: gainsboro;
  background-color: transparent;
}

h3 {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
  color: var(--color-heading);
}

@media (min-width: 1024px) {
  .item {
    margin-top: 0;
    padding: 0.4rem 0 1rem calc(var(--section-gap) / 2);
  }

  #icons {
    top: calc(50% - 25px);
    left: -26px;
    position: absolute;
    border: 1px solid var(--color-border);
    background: var(--color-background);
    border-radius: 8px;
    width: 50px;
    height: 50px;
  }
  #icons:hover {
    box-shadow: var(--box-shadow);
  }

  .item:before, .item:after{
    content: ' ';
    border-left: 1px solid var(--color-text-link-1);
    position: absolute;
    left: 0;
    height: calc(50% - 25px);
  }

  .item:before {
    bottom: calc(50% + 25px);
  }

  .item:after {
    top: calc(50% + 25px);
  }

  .item:first-of-type:before {
    display: none;
  }

  .item:last-of-type:after {
    display: none;
  }
}
</style>
