import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "../../../environments/environment"
import { Socket } from "ngx-socket-io";

@Injectable({
  providedIn: "root",
})
export class MeetingService {
  private authToken = environment.token;

  constructor(private http: HttpClient, private socket:Socket) {}

  createMeeting(): Observable<string> {
    const apiUrl = "https://api.videosdk.live/v2/rooms";
    const headers = new HttpHeaders({
      authorization: this.authToken,
      "Content-Type": "application/json",
    });

    return this.http
      .post<{ roomId: string }>(apiUrl, {token:this.authToken}, { headers })
      .pipe(map((response) => response.roomId));
  }

  validateMeeting(meetingId: string): Observable<boolean> {
    const url = `https://api.videosdk.live/v2/rooms/validate/${meetingId}`;
    const headers = new HttpHeaders({
      authorization: this.authToken,
      "Content-Type": "application/json",
    });

    return this.http
      .get<{ roomId: string }>(url, {
        headers,
      })
      .pipe(map((response) => response.roomId === meetingId));
  }


  getMessages(myuserid: any,otheruserid: any){
    return this.http.post(
      `${environment.apiUrl}/getMessage`, 
      { myuserid,otheruserid})
  }

  putMessage(senderid: any,rcvrid: any,msg:any){
    
    this.socket.emit("message_send",{senderid,rcvrid,msg})

  }

  getmessagesocket():Observable<any>{
  return  this.socket.fromEvent("message_incoming").pipe(map((data: any) => data));
  }
  getCall():Observable<any> {
  
    
    return this.socket.fromEvent("call_response").pipe(map((data: any) => data))
  
  }


  ngOnInit() {}
}