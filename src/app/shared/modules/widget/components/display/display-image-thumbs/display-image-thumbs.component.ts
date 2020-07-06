import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Logger} from '../../../utilities/logger';
import {
  FileTypes,
  ImageContainerDescriptorType,
  ImageContainerDisplayIdents,
  ImageThumbDescriptorType,
  ToggleImageType
} from '../../../models/common-model';

const options: ScrollIntoViewOptions = {behavior: 'smooth', block: 'nearest', inline: 'nearest'};

@Component({
  selector: 'app-display-image-thumbs',
  templateUrl: './display-image-thumbs.component.html',
  styleUrls: ['./display-image-thumbs.component.less']
})

export class DisplayImageThumbsComponent implements OnInit, AfterViewInit {

  @ViewChild('thumbs', {static: false}) thumbs: ElementRef;
  // Data to display ~~~~~~~~~
  containerId: string;
  containerClasses: string[];
  containerImages: ImageThumbDescriptorType[];
  isTypeOf: FileTypes;
  toggle: ToggleImageType;

  div: HTMLDivElement;

  @Input()
  set thumbsTobeDisplayed(items: ImageContainerDescriptorType) {
    if (items == null || items.images == null) { return; }
    if (this.containerImages == null
      || (JSON.stringify(this.containerImages) !== JSON.stringify(items.images)
      && (this.isTypeOf === items.isType))) {
      Logger.log('Data Changes NEW Images? ' + items.images.length, 'DisplayImageThumbsComponent.thumbsTobeDisplayed', 37);
      this.containerId = items.id == null ? '' : items.id;
      this.containerClasses = items.classes == null ? [''] : items.classes;
      this.containerImages = items.images;
      if (items.toggle != null) {
        this.toggle = items.toggle;
      }
      this.isTypeOf = items.isType;
      this.renderImages().then(resolve => Logger.log('Rendered Images',
        'DisplayImageThumbsComponent.thumbsTobeDisplayed', 45));
    }
  }
  // @Output emitter(s) for click functions ??
  @Output() doLoadImage = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.div = this.thumbs.nativeElement as HTMLDivElement;
    this.renderImages().then(resolve => Logger.log('Rendered Images',
      'DisplayImageThumbsComponent.ngAfterViewInit', 59));
  }

  get getId() {
    return this.containerId == null ? ImageContainerDisplayIdents.NONE : this.containerId;
  }

  async renderImages() {
    if (this.div != null) {
      this.div.innerHTML = '';
      this.div.style.display = this.containerImages != null ? this.containerImages.length === 0 ? 'none' : 'block' : 'none';
      if (this.containerImages != null && this.containerImages.length !== 0) {
        await this.createImageDisplay();
      }
    }
  }

  addClassesToElement(ele: HTMLElement, classesArr: string[]) {
    ele.className = '';
    const classes: DOMTokenList = ele.classList;
    classesArr.forEach(classe => {
      classes.add(classe);
    });
  }

  createImageDisplay() {
    this.addClassesToElement(this.div, this.containerClasses);
    this.containerImages.forEach(img => {
      const image = this.createImage(img);
      if (img.anchor != null) {
        const anchor: HTMLAnchorElement = document.createElement('a');
        // MUST NOT have href='#' OTHERWISE (click) on 'img' invokes [router] to landing page
        if (img.anchor.href != null) {
          anchor.href = img.anchor.href;
          anchor.target = img.anchor.target == null ? '' : img.anchor.target;
        }
        anchor.title = img.anchor.title;
        anchor.appendChild(image);
        this.div.appendChild(anchor);
      } else {
        this.div.appendChild(image);
      }
    });
  }

  createImage(imageDesc: ImageThumbDescriptorType): HTMLImageElement {
    const image: HTMLImageElement = new Image();
    image.src = 'data:' + imageDesc.fileType + ';base64,' + imageDesc.thumbnail;
    this.addClassesToElement(image, imageDesc.classes);
    image.id = imageDesc.id != null ? imageDesc.id : '';
    image.addEventListener('click', this.imageClicked.bind(this, imageDesc.id) , true);
    return image;
  }

  // noinspection JSUnusedLocalSymbols
  imageClicked(imgId: string, event: Event) { // IS SELECTED ...
    Logger.log('Clicked on Image !! Id: ' + imgId, 'DisplayImageThumbsComponent.imageClicked', 116);
    // Change any styling ...
    if (this.toggle != null) {
      this.toggleStyle(imgId);
    } else {
      this.scrollInToView(imgId);
    }
    this.doLoadImage.emit(imgId);
  }

  // Cannot querySelectAll by 'id' as id's don't always start with a letter, CSS requirement to use this.
  // If a scroll-bar is present and image only part showing.
  scrollInToView(id: string) {
    const images = this.div.querySelectorAll('img');
    images.forEach(img => {
      if (img.id === id) {
        (img as HTMLImageElement).scrollIntoView(options);
      }
    });
  }

  // Add remove Highlight, scroll into view if needed
  toggleStyle(id: string) {
    this.div.querySelector('.' + this.toggle.active).className = this.toggle.inactive;
    const images = this.div.querySelectorAll('img');
    images.forEach(img => {
      if (img.id === id) {
        img.className = this.toggle.active;
        (img as HTMLImageElement).scrollIntoView(options);
      }
    });
  }
}
