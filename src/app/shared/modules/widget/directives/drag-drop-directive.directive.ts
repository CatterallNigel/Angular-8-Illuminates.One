import {Directive, EventEmitter, HostBinding, HostListener, Output} from '@angular/core';

@Directive({
  selector: '[appFileDragDrop]'
})
export class DragDropDirectiveDirective {

  constructor() { }

  @Output() doFileDropped = new EventEmitter<any>();

  @HostBinding('style.opacity') private opacity = '1';

  // Drag Over listener
  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.opacity = '0.8';
  }

  // Drag Leave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.opacity = '1';
  }

  // Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.opacity = '1';
    const files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.doFileDropped.emit(files);
    }
  }
}
