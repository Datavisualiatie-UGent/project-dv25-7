import {html} from "htl";

export function buttonCTA(text, id, backgroundColor = "#5362a1", textColor = "#ffffff") {
  const button = html`<button id="${id}" class="button-cta">${text}</button>`;
  button.style.background = backgroundColor;
  button.style.color = textColor;

  // Apply styling
  const style = html`<style>
    .button-cta {
      border-radius: 4px;
      display: inline-block;
      font-family: -apple-system, BlinkMacSystemFont, "avenir next", avenir, helvetica, "helvetica neue", ubuntu, roboto, noto, "segoe ui", arial, sans-serif;
      font-size: 14px;
      font-weight: 600;
      line-height: 24px;
      padding: 8px 32px;
      cursor: pointer;
      border: none;
      width: 200px
    }
    .button-cta:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, .08);
      text-decoration: none;
      transform: translateY(-1px);
    }
  </style>`;

  return html`${style}${button}`;
}
