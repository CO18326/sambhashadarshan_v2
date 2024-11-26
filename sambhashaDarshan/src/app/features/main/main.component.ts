import { Component, ContentChild, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { MeetingService } from './meeting.service';
import { SessionService } from '../session.service';
import { ModalService } from './chat/modal/services/modal.service';

@Component({
  selector: 'main-root',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  conversation:any;
  caller:any;
  constructor(private meetingservice:MeetingService, private sessionService : SessionService,private modalService:ModalService){}

  ngOnInit():void{
      

      //this.initCallingState({caller_username:"Ishg"});
     
  }
  
  
  initConversation(data: any){
    this.conversation.messages=data.data;
  }


  initCallingState(data:any){
    this.caller=data.caller_username || "Ishan";
  }
  
  
  onConversationSelected(conversation:any){
    
    this.conversation={
      otheruserid :conversation.email,
      messages:[]
    }
    this.meetingservice.getMessages(this.sessionService.getUser(),conversation.email).subscribe({
      next:(response)=>{this.initConversation(response)},
      error:(error)=>{}
    })
    
    
  }
  openModal(modalTemplate: TemplateRef<any>) {
    this.modalService
      .open(modalTemplate, { size: 'lg', title: 'SambhashaDarshan' })
      .subscribe((action) => {
        console.log('modalAction', action);
      });
  }

}
