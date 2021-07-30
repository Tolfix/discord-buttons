const { MessageComponentTypes } = require('../Constants.js');
const { resolveString } = require('discord.js').Util;
const Util = require('../Util');

class MessageButton {
  constructor(data = {}) {
    this.setup(data);
  }

  setup(data) {
    this.style = 'style' in data ? Util.resolveStyle(data.style) : null;

    this.label = 'label' in data && data.label ? resolveString(data.label) : undefined;

    this.disabled = 'disabled' in data ? data.disabled : false;

    if (data.emoji) this.setEmoji(data.emoji);

    if ('url' in data && data.url) this.url = resolveString(data.url);
    else this.url = undefined;

    if (('id' in data && data.id) || ('custom_id' in data && data.custom_id)) this.custom_id = data.id || data.custom_id;
    else this.custom_id = undefined;

    return this;
  }

  setStyle(style) {
    style = Util.resolveStyle(style);
    this.style = style;
    return this;
  }

  setLabel(label) {
    label = resolveString(label);
    this.label = label;
    return this;
  }

  setDisabled(disabled) {
    if (disabled === false) this.disabled = false;
    else this.disabled = true;
    return this;
  }

  setURL(url) {
    this.url = resolveString(url);
    return this;
  }

  setID(id) {
    this.custom_id = resolveString(id);
    return this;
  }

  setEmoji(emoji, animated) {
    this.emoji = Util.resolveEmoji(emoji, animated);
    return this;
  }

  toJSON() {
    return {
      type: MessageComponentTypes.BUTTON,
      style: this.style,
      label: this.label,
      emoji: this.emoji,
      disabled: this.disabled,
      url: this.url,
      custom_id: this.custom_id,
    };
  }
}

module.exports = MessageButton;
