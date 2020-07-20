import { Component, OnInit } from '@angular/core';
import { SubregionService } from 'src/app/services/subregion.service';
import { Notice } from 'src/app/clases/notice';

@Component({
  selector: 'app-notices',
  templateUrl: './notices.component.html',
  styleUrls: ['./notices.component.scss']
})
export class NoticesComponent implements OnInit {

  listNotices: Array<Notice> = [];

  constructor(private subRegionService: SubregionService) { }

  ngOnInit(): void {
      this.subRegionService.getNotices().valueChanges().subscribe((answer)=>{
        this.listNotices=answer;
      });
  }

}
