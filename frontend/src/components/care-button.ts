export {};

type ButtonVariant = 'primary' | 'secondary' | 'danger';

const STYLES = `
  :host {
    display: inline-block;
  }

  button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.15s ease, filter 0.15s ease;
  }

  button:hover:not(:disabled) {
    filter: brightness(1.1);
  }

  button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  button.primary {
    background-color: #2563eb;
    color: #ffffff;
  }

  button.secondary {
    background-color: #e5e7eb;
    color: #111827;
  }

  button.danger {
    background-color: #dc2626;
    color: #ffffff;
  }
`;

class CareButton extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['variant', 'disabled'];
  }

  private _button: HTMLButtonElement;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = STYLES;

    this._button = document.createElement('button');
    const slot = document.createElement('slot');
    this._button.appendChild(slot);

    shadow.appendChild(style);
    shadow.appendChild(this._button);

    this._button.addEventListener('click', (e: MouseEvent) => {
      if (this._button.disabled) {
        e.stopImmediatePropagation();
        return;
      }
      this.dispatchEvent(new CustomEvent('care-click', { bubbles: true, composed: true }));
    });
  }

  connectedCallback(): void {
    this._syncVariant();
    this._syncDisabled();
  }

  attributeChangedCallback(name: string): void {
    if (name === 'variant') this._syncVariant();
    if (name === 'disabled') this._syncDisabled();
  }

  private _syncVariant(): void {
    const variant: ButtonVariant =
      (['primary', 'secondary', 'danger'] as ButtonVariant[]).find(
        (v) => v === this.getAttribute('variant')
      ) ?? 'primary';

    this._button.className = variant;
  }

  private _syncDisabled(): void {
    this._button.disabled = this.hasAttribute('disabled');
  }
}

customElements.define('care-button', CareButton);
