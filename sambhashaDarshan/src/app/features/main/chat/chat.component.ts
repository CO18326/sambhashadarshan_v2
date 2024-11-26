import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { VideoSDKMeeting } from "@videosdk.live/rtc-js-prebuilt";
import { MeetingService } from '../meeting.service';
import { SessionService } from '../../session.service';
import { ModalService } from './modal/services/modal.service';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  @Input() conversation: any;
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  emojiPickerVisible: any;
  message = '';
  constructor(private meetingService : MeetingService,private sessionService:SessionService,private modalService : ModalService,private socket:Socket) {}

  ngOnInit(): void {

    this.meetingService.getmessagesocket().subscribe({
      next:(response)=>{
        if(response.rcvrid == this.sessionService.getUser()){
        
        this.conversation.messages.unshift({
        id: 1,
        body: response.msg,
        time: response.time,
        me: false,
      });
    
    
    }
    
    
      },
      error:(error)=>{}
    })

  }

  submitMessage(event: any) {
    let value = event.target.value.trim();
    this.message = '';
    if (value.length < 1) return false;
    let date = new Date();
    this.conversation.messages.unshift({
      id: 1,
      body: value,
      time: date,
      me: true,
    });

    this.meetingService.putMessage(this.sessionService.getUser(),this.conversation.otheruserid,value);
    /*.subscribe(
      {
        next:(response)=>{},
        error:(error)=>{}
      }
    ) ;*/

    return true;
  }

  emojiClicked(event: { emoji: { native: string; }; }) {
    this.message += event.emoji.native;
  }

  init_video_call(){

    console.log("check........123");

    /*this.meetingService.createMeeting().subscribe({

    next:(data)=>{
      var config = {
        name: "TEST",
        meetingId: "check-123--12",
        apiKey: "12d6d513-6aa6-4641-a65d-27686e29595a",
  
        containerId: "check",
        redirectOnLeave: "https://www.videosdk.live/",
        realtimeTranscription:{
          enabled:false,
          visible:false
        }
        
      };
  
      const meeting = new VideoSDKMeeting();
      meeting.init(config);
    },
    error:(error)=>{}

    }
  )*/
   /* 
  var config = {
    name: "TEST",
    meetingId: this.makeid(10),
    apiKey: "12d6d513-6aa6-4641-a65d-27686e29595a",

    containerId: undefined,
    redirectOnLeave: undefined,
    realtimeTranscription:{
      enabled:false,
      visible:false
    },
    micEnabled: true,
    webcamEnabled: true,
    participantCanToggleSelfWebcam: true,
    participantCanToggleSelfMic: true,

    chatEnabled: true,
   
    
  };


  setInterval(()=>{

  },)


  const meeting = new VideoSDKMeeting();
  meeting.init(config);*/
  let newwindow=window.open("/videoCall","test",'height=600,width=1000,resizable=no');
    
  setTimeout(
    
    ()=>
    {
      if(!newwindow) {console.log("check..."); return;};
      newwindow.window.onload=()=>{
        if(!newwindow) {console.log("check..."); return;}
    console.log("check..."); newwindow.window.postMessage({from_id:this.sessionService.getUser(),to_id:this.conversation.otheruserid});
  
  
      }
  
  
  }
    
    
    
    
  
  )

  }


  openModal(modalTemplate: TemplateRef<any>) {
    this.modalService
      .open(modalTemplate, { size: 'lg', title: 'Foo' })
      .subscribe((action) => {
        console.log('modalAction', action);
      });
  }

  makeid(length:number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}
 
}
