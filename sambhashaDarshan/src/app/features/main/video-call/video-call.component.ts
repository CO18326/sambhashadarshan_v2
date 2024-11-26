import { Component, OnInit, ViewChild } from '@angular/core';
import { VideoSDKMeeting } from "@videosdk.live/rtc-js-prebuilt";
import { Socket } from 'ngx-socket-io';
import { MeetingService } from '../meeting.service';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.scss']
})
export class VideoCallComponent implements OnInit {
  isRinging: boolean = false;
  @ViewChild("ringtone") ringtone! : HTMLAudioElement;
  calle: any="Ishan";
  id:any;
  caller: any;
  audio:any;

  constructor(private socket : Socket, private meetingService: MeetingService) { }

  ngOnInit(): void {
    console.log("check");
    //this.startRinging();
    window.addEventListener(
      "message",
      (event) => {
        
        if(!event.data.meeting_id){
          //this.startRinging();
          this.initVideoCall(event);}
        else{
          this.joinVideoCall(event.data.meeting_id);
        }


    
        // …
      },
      false,
    );
  }
  joinVideoCall(meeting_id: any) {
    //this.stopRinging();
    
    var config = {
      name: "TEST",
      meetingId: meeting_id,
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

      joinScreen: {
        visible: false,
        title: "Daily scrum",
        meetingUrl: window.location.href
      }
     
      
    };
  
  
   
  
  
    const meeting = new VideoSDKMeeting();
    meeting.init(config);
    
  }

  startRinging(): void {
    this.isRinging = true;
    this.audio = new Audio();
    this.audio.src = "../../assets/ringing.mp3";
    this.audio.loop=true;
    this.audio.load();
    this.audio.play();
  }

  
  
  stopRinging(){
    this.audio.pause();
  }
  
  hungup(): void {
    if (this.id) {

      clearInterval(this.id);

    }  
    this.socket.emit("hungup",{"from_id":this.caller,"to_id":this.calle,"meeting_id":""});
    this.meetingService.putMessage(this.caller,this.calle,"********************\n\x1B Missed call\n********************");
    window.close();
  }

  initVideoCall(userData:any){

    console.log(userData.data);

    this.calle=userData.data.to_id;
    this.caller=userData.data.from_id;

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

      joinScreen: {
        visible: false,
        title: "Daily scrum",
        meetingUrl: window.location.href
      }
     
      
    };
  
  
   
  
  
    const meeting = new VideoSDKMeeting();
    
    /*this.id = setInterval(() => {

      this.socket.emit("calling",{"from_id":userData.data.from_id,"to_id":userData.data.to_id,"meeting_id":config.meetingId});


    }, 1000);*/
    
    this.socket.emit("calling",{"from_id":userData.data.from_id,"to_id":userData.data.to_id,"meeting_id":config.meetingId});
    //this.startRinging();
    this.meetingService.getCall().subscribe(
      {
        next:(response)=>{
          if(response.type=="accepted"){
          console.log("accepted_hit...!!")
          //this.stopRinging(); 
          meeting.init(config);
          /*if(this.audio){
            this.audio.pause();
          }*/
          this.socket.emit("join",{"from_id":userData.data.from_id,"to_id":userData.data.to_id,"meeting_id":config.meetingId,"type":"joined","to_session":response.to_session,"from_session":response.from_session}); 
          this.meetingService.putMessage(this.caller,this.calle,"********************\n\x1B Video call (accepted)\n********************");
        }
      
        else if (response.type=="rejected"){


    this.meetingService.putMessage(this.caller,this.calle,"********************\n\x1B Video call (got rejected)\n********************");
          window.close();
        }
      
      },
        
        
          error:(error)=>{}
      }
    )
    
    //meeting.init(config);


  }

  ngOnDestroy():void{

    if (this.id) {

      clearInterval(this.id);

    }

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
