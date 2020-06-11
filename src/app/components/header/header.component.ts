import { Component, OnInit } from '@angular/core';
import { faHome} from '@fortawesome/free-solid-svg-icons';
import { faAddressCard} from '@fortawesome/free-solid-svg-icons';
import { faQuestionCircle} from '@fortawesome/free-solid-svg-icons';
import { faThLarge} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  faHome= faHome;
  faAddressCard= faAddressCard;
  faQuestionCircle=faQuestionCircle;
  faThLarge=faThLarge;

  constructor() { }

  ngOnInit(): void {
  }

}
