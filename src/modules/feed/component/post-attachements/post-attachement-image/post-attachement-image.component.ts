import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageImageElement } from '../../../post.model';

@Component({
  selector: 'app-post-attachement-image',
  templateUrl: './post-attachement-image.component.html',
  styleUrls: ['./post-attachement-image.component.less']
})
export class PostAttachementImageComponent implements OnInit {
  @Input()
  element: MessageImageElement;

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  get url() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.element.url);
  }

  ngOnInit(): void {
  }

}
