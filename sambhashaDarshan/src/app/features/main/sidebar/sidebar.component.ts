import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SidebarService } from './sidebar.service';
import { SessionService } from '../../session.service';
import { MeetingService } from '../meeting.service';
import { Socket } from 'ngx-socket-io';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Output() conversationClicked: EventEmitter<any> = new EventEmitter();
  searchText!: string;
  /*conversations = [
    {
      name: 'David',
      time: '8:21',
      latestMessage: 'Hi there!!',
      latestMessageRead: false,
      messages: [
        { id: 1, body: 'Hello world', time: '8:21', me: true },
        { id: 2, body: 'How are you?', time: '8:21', me: false },
        { id: 3, body: 'I am fine thanks', time: '8:21', me: true },
        { id: 4, body: 'Glad to hear that', time: '8:21', me: false },
      ],
    },
    {
      name: 'James',
      time: '8:21',
      latestMessage: 'wow',
      latestMessageRead: true,
      messages: [
        { id: 1, body: 'Hello world', time: '8:21', me: true },
        { id: 2, body: 'How are you?', time: '8:21', me: false },
        { id: 3, body: 'I am fine thanks', time: '8:21', me: true },
        { id: 4, body: 'Glad to hear that', time: '8:21', me: false },
      ],
    },
    {
      name: 'Andrew',
      time: '8:21',
      latestMessage: 'I am fine',
      latestMessageRead: false,
      messages: [
        { id: 1, body: 'Hello world', time: '8:21', me: true },
        { id: 2, body: 'How are you?', time: '8:21', me: false },
        { id: 3, body: 'I am fine thanks', time: '8:21', me: true },
        { id: 4, body: 'Glad to hear that', time: '8:21', me: false },
      ],
    },
    {
      name: 'Richard',
      time: '8:21',
      latestMessage: 'lol',
      latestMessageRead: true,
      messages: [
        { id: 1, body: 'Hello world', time: '8:21', me: true },
        { id: 2, body: 'How are you?', time: '8:21', me: false },
        { id: 3, body: 'I am fine thanks', time: '8:21', me: true },
        { id: 4, body: 'Glad to hear that', time: '8:21', me: false },
      ],
    },
    {
      name: 'Dyno',
      time: '8:21',
      latestMessage: 'Alright',
      latestMessageRead: false,
      messages: [
        { id: 1, body: 'Hello world', time: '8:21', me: true },
        { id: 2, body: 'How are you?', time: '8:21', me: false },
        { id: 3, body: 'I am fine thanks', time: '8:21', me: true },
        { id: 4, body: 'Glad to hear that', time: '8:21', me: false },
      ],
    },
    {
      name: 'Julie',
      time: '8:21',
      latestMessage: "Let's go",
      latestMessageRead: false,
      messages: [
        { id: 1, body: 'Hello world', time: '8:21', me: true },
        { id: 2, body: 'How are you?', time: '8:21', me: false },
        { id: 3, body: 'I am fine thanks', time: '8:21', me: true },
        { id: 4, body: 'Glad to hear that', time: '8:21', me: false },
      ],
    },
    {
      name: 'Tom',
      time: '8:21',
      latestMessage: 'I see',
      latestMessageRead: true,
      messages: [
        { id: 1, body: 'Hello world', time: '8:21', me: true },
        { id: 2, body: 'How are you?', time: '8:21', me: false },
        { id: 3, body: 'I am fine thanks', time: '8:21', me: true },
        { id: 4, body: 'Glad to hear that', time: '8:21', me: false },
      ],
    },
    {
      name: 'Jerry',
      time: '8:21',
      latestMessage: 'OMG',
      latestMessageRead: false,
      messages: [
        { id: 1, body: 'Hello world', time: '8:21', me: true },
        { id: 2, body: 'How are you?', time: '8:21', me: false },
        { id: 3, body: 'I am fine thanks', time: '8:21', me: true },
        { id: 4, body: 'Glad to hear that', time: '8:21', me: false },
      ],
    },
    {
      name: 'Grey',
      time: '8:21',
      latestMessage: 'Oh No',
      latestMessageRead: false,
      messages: [
        { id: 1, body: 'Hello world', time: '8:21', me: true },
        { id: 2, body: 'How are you?', time: '8:21', me: false },
        { id: 3, body: 'I am fine thanks', time: '8:21', me: true },
        { id: 4, body: 'Glad to hear that', time: '8:21', me: false },
      ],
    },
    {
      name: 'Jill',
      time: '8:21',
      latestMessage: 'Thanks',
      latestMessageRead: true,
      messages: [
        { id: 1, body: 'Hello world', time: '8:21', me: true },
        { id: 2, body: 'How are you?', time: '8:21', me: false },
        { id: 3, body: 'I am fine thanks', time: '8:21', me: true },
        { id: 4, body: 'Glad to hear that', time: '8:21', me: false },
      ],
    },
    {
      name: 'Blue',
      time: '8:21',
      latestMessage: 'Take care',
      latestMessageRead: false,
      messages: [
        { id: 1, body: 'Hello world', time: '8:21', me: true },
        { id: 2, body: 'How are you?', time: '8:21', me: false },
        { id: 3, body: 'I am fine thanks', time: '8:21', me: true },
        { id: 4, body: 'Glad to hear that', time: '8:21', me: false },
      ],
    },
    {
      name: 'King',
      time: '8:21',
      latestMessage: 'I am coming now',
      latestMessageRead: false,
      messages: [
        { id: 1, body: 'Hello world', time: '8:21', me: true },
        { id: 2, body: 'How are you?', time: '8:21', me: false },
        { id: 3, body: 'I am fine thanks', time: '8:21', me: true },
        { id: 4, body: 'Glad to hear that', time: '8:21', me: false },
      ],
    },
    {
      name: 'Kong',
      time: '8:21',
      latestMessage: 'Good Morning!',
      latestMessageRead: true,
      messages: [
        { id: 1, body: 'Hello world', time: '8:21', me: true },
        { id: 2, body: 'How are you?', time: '8:21', me: false },
        { id: 3, body: 'I am fine thanks', time: '8:21', me: true },
        { id: 4, body: 'Glad to hear that', time: '8:21', me: false },
      ],
    },
    {
      name: 'Rock',
      time: '8:21',
      latestMessage: 'Good Morning!',
      latestMessageRead: true,
      messages: [
        { id: 1, body: 'Hello world', time: '8:21', me: true },
        { id: 2, body: 'How are you?', time: '8:21', me: false },
        { id: 3, body: 'I am fine thanks', time: '8:21', me: true },
        { id: 4, body: 'Glad to hear that', time: '8:21', me: false },
      ],
    },
  ]*/
 
  conversations:{_id:String,displayName:string,email:String,user_id:String}[]=[];
  filteredConversations:{_id:String,displayName:string,email:String,user_id:String}[]=[];
  showToolbar: boolean=false;
  userData: any;
  audio: any;

  /*get filteredConversations() {
    return this.conversations.filter((conversation) => {
      return (
        conversation.name
          .toLowerCase()
          .includes(this.searchText.toLowerCase())
      );
    });
  }*/

  constructor(private sidebarservice:SidebarService, private sessionService : SessionService, private meetingService : MeetingService, private socket: Socket) {}

  ngOnInit(): void {

    



    this.sidebarservice.getusers(this.sessionService.getUser()).subscribe({
      next:(response)=>{this.conversations=this.jsonify_string(response)},
      error:(error)=>{}
    })


    this.meetingService.getCall().subscribe(
      {
        next:(response)=>{
          console.log("check...")
          if(response.type=="incomming_call" && response.from_id != this.sessionService.getUser()){

            
            this.userData = response;
            
            this.showToolbar=true;
            this.startRinging();


          }


          if(response.type=="hungup" && response.from_id != this.sessionService.getUser()){

            
            this.userData = response;
            
            this.showToolbar=false;
            this.audio.pause();


          }

          if(response.type=="joined" && response.from_id != this.sessionService.getUser()){

            let newwindow=window.open("/videoCall","test",'height=600,width=1000,resizable=no');

            this.userData = response;
    
  setTimeout(
    
    ()=>
    {
      if(!newwindow) {console.log("check..."); return;};
      newwindow.window.onload=()=>{
        if(!newwindow) {console.log("check..."); return;}
    console.log("check..."); newwindow.window.postMessage({meeting_id:this.userData.meeting_id});
  
  
      }
  
  
  }
    
    
    
    
  
  )
            


          }

        },
        error:(error)=>{}

      }
    )


  }

  jsonify_string(data:any){
    return JSON.parse(data.data);
  }

  startRinging(): void {
    this.audio = new Audio();
    this.audio.src = "../../assets/ringing.mp3";
    this.audio.loop=true;
    this.audio.load();
    this.audio.play();
  }

  accept(){
    this.socket.emit("accept",{"from_id":this.userData.from_id,"to_id":this.userData.to_id,"meeting_id":this.userData.meeting_id,"type":"accepted","to_session":this.userData.to_session,"from_session":this.userData.from_session});
    this.showToolbar=false;
    this.audio.pause();

  }

  reject(){
    this.socket.emit("reject",{"from_id":this.userData.from_id,"to_id":this.userData.to_id,"meeting_id":this.userData.meeting_id,"type":"rejected","to_session":this.userData.to_session,"from_session":this.userData.from_session});
    this.showToolbar=false;
    this.audio.pause();
  }


  search(){
    this.filteredConversations=this.conversations.filter((conversation) => {
      return (
        conversation.displayName
          .toLowerCase()
          .includes(this.searchText.toLowerCase())
      );
    });

  }
    
  
}
