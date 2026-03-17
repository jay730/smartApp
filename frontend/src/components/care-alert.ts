export {};

type AlertVariant = 'info' | 'warning' | 'error' | 'success';

const VARIANT_STYLES: Record<AlertVariant, string> = {
  info:    'background:#eff6ff; border-color:#2563eb; color:#1e3a5f;',
  warning: 'background:#fffbeb; border-color:#d97706; color:#78350f;',
  error:   'background:#fef2f2; border-color:#dc2626; color:#7f1d1d;',
  success: 'background:#f0fdf4; border-color:#16a34a; color:#14532d;',
};

const STYLES = `
  :host {
    display: block;
  }

  :host([hidden]) {
    display: none;
  }

  .alert {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 16px;
    border-left: 4px solid;
    border-radius: 4px;
    font-size: 14px;
    line-height: 1.5;
  }

  .message {
    flex: 1;
  }

  .dismiss {
    flex-shrink: 0;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    line-height: 1;
    padding: 0;
    opacity: 0.6;
    color: inherit;
    transition: opacity 0.15s ease;
  }

  .dismiss:hover {
    opacity: 1;
  }
`;

class CareAlert extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['variant', 'dismissible'];
  }

  private _alert: HTMLDivElement;
  private _dismissBtn: HTMLButtonElement;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = STYLES;

    this._alert = document.createElement('div');
    this._alert.className = 'alert';

    const message = document.createElement('div');
    message.className = 'message';
    message.appendChild(document.createElement('slot'));

    this._dismissBtn = document.createElement('button');
    this._dismissBtn.className = 'dismiss';
    this._dismissBtn.setAttribute('aria-label', 'Dismiss');
    this._dismissBtn.textContent = '✕';

    this._dismissBtn.addEventListener('click', () => {
      this.setAttribute('hidden', '');
      this.dispatchEvent(new CustomEvent('care-dismiss', { bubbles: true, composed: true }));
    });

    this._alert.appendChild(message);
    this._alert.appendChild(this._dismissBtn);

    shadow.appendChild(style);
    shadow.appendChild(this._alert);
  }

  connectedCallback(): void {
    this._syncVariant();
    this._syncDismissible();
  }

  attributeChangedCallback(name: string): void {
    if (name === 'variant') this._syncVariant();
    if (name === 'dismissible') this._syncDismissible();
  }

  private _syncVariant(): void {
    const variant: AlertVariant =
      (['info', 'warning', 'error', 'success'] as AlertVariant[]).find(
        (v) => v === this.getAttribute('variant')
      ) ?? 'info';

    this._alert.setAttribute('style', VARIANT_STYLES[variant]);
  }

  private _syncDismissible(): void {
    this._dismissBtn.style.display = this.hasAttribute('dismissible') ? '' : 'none';
  }
}

customElements.define('care-alert', CareAlert);
