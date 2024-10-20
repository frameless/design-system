export class FramelessLiveHtmlSourceElement extends HTMLElement {
  static observedAttributes = ['query', 'type'];

  connected = false;
  paintId = -1;
  targetNode = null;
  type = '';

  constructor() {
    super();

    this.render = () => {
      const targetNode = this.ownerDocument.querySelector(this.getAttribute('query'));

      this.textContent = targetNode
        ? this.type === 'outerHTML'
          ? targetNode.outerHTML
          : this.type === 'innerHTML' || !this.type
            ? targetNode.innerHTML
            : ''
        : '';
    };

    this.type = this.getAttribute('type');
    this.observer = new MutationObserver(() => {
      this.render();
    });
  }

  updateTarget(query) {
    const newTarget = this.ownerDocument.querySelector(query);

    this.updateTargetNode(newTarget);
  }

  setType(type) {
    if (FramelessLiveHtmlSourceElement.observedAttributes.includes(type)) {
      if (this.type !== type) {
        this.dirty();
      }
      this.type = type;
    }
  }

  dirty() {
    if (this.paintId === -1) {
      this.paintId = requestAnimationFrame(() => {
        this.paintId = -1;
        this.render();
      });
    }
  }

  updateTargetNode(newTarget) {
    if (newTarget) {
      if (newTarget !== this.targetNode) {
        this.dirty();
      }

      this.targetNode = newTarget;
      this.observer.observe(this.targetNode, {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true,
      });
    }
    if (newTarget !== this.targetNode) {
      this.dirty();
    }

    this.targetNode = newTarget;
  }

  attributeChangedCallback(name, _, value) {
    if (name === 'type') {
      this.setType(value);
    } else if (name === 'query') {
      this.targetNode = this.updateTarget(value);
    }
  }

  connectedCallback() {
    this.connected = true;
    if (this.targetNode) {
      this.dirty();
    }
  }

  disconnectedCallback() {
    if (this.paintId !== -1) {
      cancelAnimationFrame(this.paintId);
      this.paintId = -1;
    }

    this.connected = false;
    this.observer.disconnect();
  }
}
