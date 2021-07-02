import discord, {
  Snowflake,
  Guild,
  Channel,
  User,
  GuildMember,
  Collector,
  CollectorFilter,
  Collection,
  CollectorOptions,
  APIMessageContentResolvable,
  MessageEmbed,
  MessageAttachment,
  StringResolvable,
  SplitOptions,
} from 'discord.js';

declare module 'discord.js' {
  export interface ClientEvents {
    clickButton: [MessageComponent];
    clickMenu: [MessageComponent];
  }

  export interface MessageOptions {
    component?: MessageButton | MessageActionRow;
    components?: MessageActionRow[];
    button?: MessageButton | MessageButton[];
    buttons?: MessageButton | MessageButton[];
  }

  export interface Message {
    components: MessageActionRow[];
    createButtonCollector(filter: CollectorFilter, options?: AwaitMessageButtonOptions): ButtonCollector;
    awaitButtons(filter: CollectorFilter, options?: AwaitMessageButtonOptions): Promise<Collection<Snowflake, MessageComponent>>;
  }

  export interface WebhookClient {
    editMessage(message: string, content: any, options?: {}): Promise<any>;
    deleteMessage(message: string): Promise<void>;
    fetchMessage(message: string, cache?: boolean): Promise<any>;
  }

  export interface PartialTextBasedChannelFields {
    send(content: APIMessageContentResolvable | (MessageOptions & { split?: false }) | MessageAdditions): Promise<Message>;
    send(options: MessageOptions & { split: true | SplitOptions }): Promise<Message[]>;
    send(options: MessageOptions | discord.APIMessage): Promise<Message | Message[]>;
    send(content: StringResolvable, options: (MessageOptions & { split?: false }) | MessageAdditions): Promise<Message>;
    send(content: StringResolvable, options: MessageOptions & { split: true | SplitOptions }): Promise<Message[]>;
    send(content: StringResolvable, options: MessageOptions): Promise<Message | Message[]>;
    send(content: StringResolvable, options: MessageButton | MessageActionRow): Promise<Message | Message[]>;
  }
}

export enum MessageComponentTypes {
  ACTION_ROW = 1,
  BUTTON = 2,
  SELECT_MENU = 3,
}

export enum MessageButtonStyles {
  blurple = 1,
  grey = 2,
  green = 3,
  red = 4,
  url = 5,

  //Aliases
  gray = 2,
  PRIMARY = 1,
  SECONDARY = 2,
  SUCCESS = 3,
  DESTRUCTIVE = 4,
  LINK = 5,
}

export type MessageButtonStyle = keyof typeof MessageButtonStyles;

export type MessageButtonStyleResolvable = MessageButtonStyle | MessageButtonStyles;

export interface GuildButtonEmoji {
  name?: string;
  id?: Snowflake;
  animated?: boolean;
}

export interface MessageButtonOptions {
  type: MessageComponentTypes.BUTTON;
  style: MessageButtonStyleResolvable;
  label?: string;
  disabled?: boolean;
  emoji?: string | GuildButtonEmoji;
  url?: string;
  id?: string;
  custom_id?: string;
}

export interface MessageMenuOptions
{
  type: MessageComponentTypes.SELECT_MENU;
  label?: string;
  emoji?: string | GuildButtonEmoji;
  description?: string;
  value?: string;
}

export interface MessageButtonData {
  type?: MessageComponentTypes.BUTTON;
  style: MessageButtonStyles | number;
  label?: string;
  disabled?: boolean;
  emoji?: GuildButtonEmoji;
  url?: string;
  custom_id?: string;
}

export interface MessageActionRowData {
  type: number | string;
  components: MessageButton[];
}

export interface MessageMenuData
{
  type?: MessageComponentTypes.SELECT_MENU;
  placeholder?: string;
  custom_id?: string;
  max_values?: number;
  min_values?: number;
  options?: any;
}

export interface MessageMenuOptionsData
{
  label?: string;
  emoji?: string | GuildButtonEmoji;
  description?: string;
  value?: string;
}

export class InteractionReply {
  constructor(client: discord.Client, component: MessageComponent, webhook: WebhookClient);
  client: discord.Client;
  component: MessageComponent;
  webhook: WebhookClient;
  has: boolean;
  isEphemeral: boolean;
  send(content: APIMessageContentResolvable | (MessageOptions & { split?: false }) | MessageAdditions): Promise<any>;
  edit(content: APIMessageContentResolvable | (MessageOptions & { split?: false }) | MessageAdditions): Promise<any>;
  defer(ephemeral: boolean): Promise<any>;
  think(ephemeral: boolean): Promise<any>;
  fetch(): Promise<any>;
  delete(): Promise<void>;
}

export class MessageComponent {
  constructor(client: discord.Client, data: any, menu: Boolean);
  client: discord.Client;
  id: Snowflake;
  version: any;
  token: string;
  discordID: Snowflake;
  applicationID: Snowflake;
  guild: Guild;
  channel: Channel;
  clicker: {
    id: Snowflake;
    user: User;
    member: GuildMember;
    fetch: () => Promise<boolean>;
  };
  message: Message;
  webhook: WebhookClient;
  reply: InteractionReply;
}

export class BaseMessageComponent {
  constructor(data: MessageActionRow | MessageButton);
  private static create(data: MessageActionRow | MessageButton): MessageActionRow | MessageButton;
}

export class MessageActionRow extends BaseMessageComponent {
  constructor(data?: {});
  setup(data: any): MessageActionRow;
  component: MessageButton;
  components: MessageButton[];
  addComponents(...components: MessageButton[]): MessageActionRow;
  addComponent(component: MessageButton): MessageActionRow;
  toJSON(): {
    components: MessageButton[];
    type: string | number;
  };
}

export class MessageButton extends BaseMessageComponent {
  constructor(data?: MessageButton | MessageButtonData | MessageButtonOptions);
  public setup(data: any): MessageButton;
  public style: MessageButtonStyles;
  public label: string;
  public disabled: boolean;
  public emoji: GuildButtonEmoji;
  public url: string;
  public custom_id: string;
  public setStyle(style: MessageButtonStyleResolvable): MessageButton;
  public setLabel(label: string): MessageButton;
  public setDisabled(disabled?: boolean): MessageButton;
  public setURL(url: string): MessageButton;
  public setID(id: string): MessageButton;
  public setEmoji(emoji: any): MessageButton;
  public toJSON(): MessageButtonData;
}

export class MessageMenu extends BaseMessageComponent
{
  constructor(data?: any)
  public setup(data: any): MessageMenu;
  public setPlaceholder(label: string): MessageMenu;
  public setID(id: string): MessageMenu;
  public setMaxValues(number: number): MessageMenu;
  public setMinValues(number: number): MessageMenu;
  public addOption(option: MessageMenuOption): MessageMenu;
  public addOptions(...options: MessageMenuOption[]): MessageMenu;
  public removeOptions(index: number, deleteCount: number, ...options: MessageMenuOption[]): MessageMenu;
  public toJSON(): MessageMenuData;
}

export class MessageMenuOption extends BaseMessageComponent
{
  constructor(data?: MessageMenuOptionsData);
  public setup(data: MessageMenuOptions): MessageMenuOption;
  public setLabel(label: string): MessageMenuOption;
  public setValue(value: string): MessageMenuOption;
  public setDescription(value: string): MessageMenuOption;
  public setDefault(def?: Boolean): MessageMenuOption;
  public setEmoji(emoji: string|GuildButtonEmoji, animted?: Boolean): MessageMenuOption;
  public toJSON(): MessageMenuOptionsData;
}

export interface MessageOptions extends discord.MessageOptions {
  component?: MessageButton | MessageActionRow;
  components?: MessageActionRow[];
  button?: MessageButton | MessageButton[];
  buttons?: MessageButton | MessageButton[];
}

export interface ReplyOptions extends MessageOptions {
  ephemeral?: boolean;
  flags?: number;
}

export class WebhookClient extends discord.WebhookClient {
  editMessage(message: string, content: any, options?: {}): Promise<any>;
  deleteMessage(message: string): Promise<void>;
  fetchMessage(message: string, cache?: boolean): Promise<any>;
}

export interface Message extends discord.Message {
  components: MessageActionRow[];
  createButtonCollector(filter: CollectorFilter, options?: AwaitMessageButtonOptions): ButtonCollector;
  awaitButtons(filter: CollectorFilter, options?: AwaitMessageButtonOptions): Promise<Collection<Snowflake, MessageComponent>>;
}

export interface MessageButtonCollectorOptions extends CollectorOptions {
  max?: number;
  maxButtons?: number;
  maxUsers?: number;
}

export interface AwaitMessageButtonOptions extends MessageButtonCollectorOptions {
  errors?: string[];
}

export class ButtonCollector extends Collector<Snowflake, MessageComponent> {
  constructor(message: Message, filter: CollectorFilter, options?: MessageButtonCollectorOptions);
  message: Message;
  users: Collection<Snowflake, User>;
  total: number;
  empty(): void;
  endReason(): string | null;
  _handleChannelDeletion(channel: Channel): void;
  _handleGuildDeletion(guild: Guild): void;
  _handleMessageDeletion(message: Message): void;

  collect(button: MessageButton): Snowflake;
  dispose(button: MessageButton): Snowflake;
  on(event: 'collect' | 'dispose', listener: (interaction: MessageComponent) => Awaited<void>): this;
  on(event: 'end', listener: (collected: Collection<Snowflake, MessageComponent>, reason: string) => Awaited<void>): this;
  on(event: string, listener: (...data: any[]) => Awaited<void>): this;

  once(event: 'collect' | 'dispose', listener: (interaction: MessageComponent) => Awaited<void>): this;
  once(event: 'end', listener: (collected: Collection<Snowflake, MessageComponent>, reason: string) => Awaited<void>): this;
  once(event: string, listener: (...data: any[]) => Awaited<void>): this;
}

export type MessageAdditions =
  | MessageEmbed
  | MessageAttachment
  | MessageButton
  | MessageActionRow
  | (MessageEmbed | MessageAttachment | MessageButton | MessageActionRow)[];

export type Awaited<T> = T | Promise<T>;

export interface ExtendedTextChannel extends discord.TextChannel {
  send(content: APIMessageContentResolvable | (MessageOptions & { split?: false }) | MessageAdditions): Promise<Message>;
  send(options: MessageOptions & { split: true | SplitOptions }): Promise<Message[]>;
  send(options: MessageOptions | discord.APIMessage): Promise<Message | Message[]>;
  send(content: StringResolvable, options: (MessageOptions & { split?: false }) | MessageAdditions): Promise<Message>;
  send(content: StringResolvable, options: MessageOptions & { split: true | SplitOptions }): Promise<Message[]>;
  send(content: StringResolvable, options: MessageOptions): Promise<Message | Message[]>;
  send(content: StringResolvable, options: MessageButton | MessageActionRow): Promise<Message | Message[]>;
}

export interface ExtendedDMChannel extends discord.DMChannel {
  send(content: APIMessageContentResolvable | (MessageOptions & { split?: false }) | MessageAdditions): Promise<Message>;
  send(options: MessageOptions & { split: true | SplitOptions }): Promise<Message[]>;
  send(options: MessageOptions | discord.APIMessage): Promise<Message | Message[]>;
  send(content: StringResolvable, options: (MessageOptions & { split?: false }) | MessageAdditions): Promise<Message>;
  send(content: StringResolvable, options: MessageOptions & { split: true | SplitOptions }): Promise<Message[]>;
  send(content: StringResolvable, options: MessageOptions): Promise<Message | Message[]>;
  send(content: StringResolvable, options: MessageButton | MessageActionRow): Promise<Message | Message[]>;
}

export interface ExtendedNewsChannel extends discord.NewsChannel {
  send(content: APIMessageContentResolvable | (MessageOptions & { split?: false }) | MessageAdditions): Promise<Message>;
  send(options: MessageOptions & { split: true | SplitOptions }): Promise<Message[]>;
  send(options: MessageOptions | discord.APIMessage): Promise<Message | Message[]>;
  send(content: StringResolvable, options: (MessageOptions & { split?: false }) | MessageAdditions): Promise<Message>;
  send(content: StringResolvable, options: MessageOptions & { split: true | SplitOptions }): Promise<Message[]>;
  send(content: StringResolvable, options: MessageOptions): Promise<Message | Message[]>;
  send(content: StringResolvable, options: MessageButton | MessageActionRow): Promise<Message | Message[]>;
}

declare module 'discord-buttons' {
  export default function (client: discord.Client): void;
}
