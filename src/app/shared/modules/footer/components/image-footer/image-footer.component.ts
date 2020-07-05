import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-footer',
  templateUrl: './image-footer.component.html',
  styleUrls: ['./image-footer.component.less']
})
export class ImageFooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  get currentYesr() {
    return (new Date()).getFullYear();
  }
}
