type Dependencies = {
  adapter: any;
  WebSocket: (server: string, protocol: string) => WebSocket;
  isArray: (array: any) => array is Array<any>;
  extension: () => boolean;
  httpAPICall: (url: string, options: any) => void;
};

type DependenciesResult = {
  adapter: any;
  newWebSocket: (server: string, protocol: string) => WebSocket;
  isArray: (array: any) => array is Array<any>;
  extension: () => boolean;
  httpAPICall: (url: string, options: any) => void;
};

export type JSEP = {
  type: string;
};

type InitOptions = {
  debug?: boolean | "all" | DebugLevel[];
  callback?: () => void;
  dependencies?: DependenciesResult;
};

type ConstructorOptions = {
  server: string | string[];
  iceServers?: RTCIceServer[];
  ipv6?: boolean;
  withCredentials?: boolean;
  max_poll_events?: number;
  destroyOnUnload?: boolean;
  token?: string;
  apisecret?: string;
  success?: () => void;
  error?: (error: any) => void;
  destroyed?: () => void;
};

type VideoRoomEventType =
  | "attached"
  | "created"
  | "joined"
  | "destroyed"
  | "event"
  | "talking"
  | "stopped-talking"
  | "rtp_forward"
  | "stop_rtp_forward";

interface Publisher {
  id: string;
  display: string;
  audio: string;
  video: string;
}

type Message = {
  videoroom: VideoRoomEventType;
  id: number;
  private_id: string;
  room: number;
  display: string;
  substream: number;
  temporal: number;
  publishers?: Publisher[];
  leaving: string | number;
  unpublished: string | number;
  error: any;
};

export type Publisher = {
  id: string;
  video: string;
};

type PluginOptions = {
  plugin: string;
  opaqueId?: string;
  success?: (handle: PluginHandle) => void;
  error?: (error: any) => void;
  consentDialog?: (on: boolean) => void;
  webrtcState?: (isConnected: boolean) => void;
  iceState?: (state: "connected" | "failed") => void;
  mediaState?: (
    medium: "audio" | "video",
    receiving: boolean,
    mid?: number,
  ) => void;
  slowLink?: (state: { uplink: boolean }) => void;
  onmessage?: (message: Message, jsep?: JSEP) => void;
  onlocalstream?: (stream: MediaStream) => void;
  onremotestream?: (stream: MediaStream) => void;
};

type OfferParams = {
  media?: {
    audioSend?: boolean;
    audioRecv?: boolean;
    videoSend?: boolean;
    videoRecv?: boolean;
    audio?: boolean | { deviceId: string };
    video?:
      | boolean
      | { deviceId: string }
      | "lowres"
      | "lowres-16:9"
      | "stdres"
      | "stdres-16:9"
      | "hires"
      | "hires-16:9";
    data?: boolean;
    failIfNoAudio?: boolean;
    failIfNoVideo?: boolean;
    screenshareFrameRate?: number;
  };
  simulcast: boolean;
  trickle?: boolean;
  stream?: MediaStream;
  success: (jsep: JSEP) => void;
  error: (error: any) => void;
};

export type PluginHandle = {
  plugin: string;
  id: string;
  token?: string;
  detached: boolean;
  simulcastStarted: boolean;
  videoCodec: string;
  rfid: number;
  rfdisplay: string;
  webrtcStuff: {
    started: boolean;
    myStream: MediaStream;
    streamExternal: boolean;
    remoteStream: MediaStream;
    mySdp: any;
    mediaConstraints: any;
    pc: RTCPeerConnection;
    dataChannel: RTCDataChannel[];
    dtmfSender: any;
    trickle: boolean;
    iceDone: boolean;
    volume: {
      value: number;
      timer: number;
    };
  };

  getId(): string;

  getPlugin(): string;

  send(message: PluginMessag): void;

  createOffer(params: OfferParams): void;

  createAnswer(params: any): void;

  handleRemoteJsep(params: { jsep: JSEP }): void;

  dtmf(params: any): void;

  data(params: any): void;

  isAudioMuted(): boolean;

  muteAudio(): void;

  unmuteAudio(): void;

  isVideoMuted(): boolean;

  muteVideo(): void;

  unmuteVideo(): void;

  getBitrate(): string;

  hangup(sendRequest?: boolean): void;

  detach(params?: any): void;
};

export default class Janus {
  static webRTCAdapter: any;
  static safariVp8: boolean;

  static useDefaultDependencies(
    deps: Partial<Dependencies>,
  ): DependenciesResult;

  static init(options: InitOptions): void;

  static isWebrtcSupported(): boolean;

  static debug(...args: any[]): void;

  static log(...args: any[]): void;

  static warn(...args: any[]): void;

  static error(...args: any[]): void;

  static randomString(length: number): string;

  static attachMediaStream(
    element: HTMLMediaElement,
    stream: MediaStream,
  ): void;

  static reattachMediaStream(
    to: HTMLMediaElement,
    from: HTMLMediaElement,
  ): void;

  constructor(options: ConstructorOptions);

  getServer(): string;

  isConnected(): boolean;

  getSessionId(): string;

  attach(options: PluginOptions): void;

  destroy(): void;
}
