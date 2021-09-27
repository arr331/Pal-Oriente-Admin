import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Breadcrumb, BreadPaths } from 'src/app/utils/breadcrumb';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  paths: BehaviorSubject<BreadPaths[]>;

  constructor() { }

  ngOnInit(): void {
    this.paths = Breadcrumb.paths;
  }

}
