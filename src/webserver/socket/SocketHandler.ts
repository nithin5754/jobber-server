import {  Server, Socket } from "socket.io";






export abstract class SocketHandler {
  protected io:Server;
  constructor(io:Server) {
    this.io=io
  }


  public abstract registerEvents(socket:Socket):void;
}