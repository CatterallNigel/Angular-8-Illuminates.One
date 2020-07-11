import {
  AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output,
  ViewChild
} from '@angular/core';
import {Logger} from '../../../utilities/logger';
import {
  CategoryItemsUpdateType,
  FileTypes,
  ImageContainerDescriptorType,
  ImageContainerDisplayIdents,
  ImageThumbDescriptorType, RolloverAction, RolloverActionDescriptorType,
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
  rollover: RolloverActionDescriptorType;

  div: HTMLDivElement;

  @Input()
  set thumbsTobeDisplayed(items: ImageContainerDescriptorType) {
    if (items == null || items.images == null) { return; }
    if (this.containerImages == null
      || (JSON.stringify(this.containerImages) !== JSON.stringify(items.images)
      && (this.isTypeOf === items.isType))) {
      Logger.log('Data Changes NEW Images? ' + items.images.length, 'DisplayImageThumbsComponent.thumbsTobeDisplayed', 42);
      this.containerId = items.id == null ? '' : items.id;
      this.containerClasses = items.classes == null ? [''] : items.classes;
      this.containerImages = items.images;
      this.toggle = items.toggle;
      this.rollover = items.rollover;
      this.isTypeOf = items.isType;
      this.renderImages().then(resolve => Logger.log('Rendered Images',
        'DisplayImageThumbsComponent.thumbsTobeDisplayed', 49)).catch(
          e => Logger.error('Display Thumbs ERROR: ' + e.message,
            'DisplayImageThumbsComponent.thumbsTobeDisplayed', 50)
      );
    }
  }
  // @Output emitter for onClick function
  @Output() doLoadImage = new EventEmitter<string>();

  lastUpdateId: string;
  noOfItems: number;

  @Input()
  set updateItemCount(update: CategoryItemsUpdateType) {
    if (update.id != null && (this.lastUpdateId == null || this.lastUpdateId !== update.id
        || this.noOfItems !== update.noOfItems)) {
      this.lastUpdateId = update.id;
      this.noOfItems = update.noOfItems;
      if (update.title != null) {
        this.updateImageTitle(update.title);
      }
    }
  }

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.div = this.thumbs.nativeElement as HTMLDivElement;
    this.renderImages().then(resolve => Logger.log('Rendered Images',
      'DisplayImageThumbsComponent.ngAfterViewInit', 82)).catch(
        reject => Logger.error('Display Thumbs ERROR: ' + reject.message,
      'DisplayImageThumbsComponent.ngAfterViewInit', 83)
    );
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

  removeClassesFromElement(ele: HTMLElement, classesArr: string[]) {
    const classes: DOMTokenList = ele.classList;
    classesArr.forEach(classe => {
      classes.remove(classe);
    });
  }

  createImageDisplay() {
    this.addClassesToElement(this.div, this.containerClasses);
    let selectedImage: HTMLImageElement;
    this.containerImages.forEach(img => {
      if (img != null) {
        const image = this.createImage(img);
        if (this.toggle != null && img.classes.indexOf(this.toggle.active) !== -1) {
          selectedImage = image;
        }
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
          image.title = img.title != null ? img.title : '';
          this.div.appendChild(image);
        }
        }
    });
    // Fixes if new selected image is at the top and is highlighted and out of view
    // Brief pause as border may not have been drawn
    // noinspection JSUnusedAssignment
    if (selectedImage != null) {
      setTimeout(() => {
        selectedImage.scrollIntoView(options);
      }, 20);
    }
  }

  createImage(imageDesc: ImageThumbDescriptorType): HTMLImageElement {
    const image: HTMLImageElement = new Image();
    image.src = 'data:' + imageDesc.fileType + ';base64,' + imageDesc.thumbnail;
    this.addClassesToElement(image, imageDesc.classes);
    image.id = imageDesc.id != null ? imageDesc.id : '';
    image.addEventListener('click', this.imageClicked.bind(this, imageDesc.id) , true);
    // Can't use DIRECTIVE as you can't bind them dymanically
    if (this.rollover != null && this.rollover.type === RolloverAction.MOUSE) {
      image.addEventListener('mouseover', this.mouseEvent.bind(this, imageDesc.id), true);
      image.addEventListener('mouseout', this.mouseEvent.bind(this, imageDesc.id), true);
    }
    return image;
  }

  // noinspection JSUnusedLocalSymbols
  imageClicked(imgId: string, event: Event) { // IS SELECTED ...
    Logger.log('Clicked on Image !! Id: ' + imgId, 'DisplayImageThumbsComponent.imageClicked', 168);
    // Change any styling ...
    if (this.toggle != null) {
      this.toggleStyle(imgId);
    } else {
      this.scrollInToView(imgId);
    }
    this.doLoadImage.emit(imgId);
  }

  mouseEvent(id: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    Logger.log('Type of EVENT is: ' + event.type, 'DisplayImageThumbsComponent.mouseEvent', 182);
    const image = this.findImage(id);
    if (this.toggle != null) {
      if (image.className === this.toggle.active) {
        image.scrollIntoView(options);
        return;
      }
    }
    switch (event.type) {
      case 'mouseover':
        // We want to add the present class to the rollover classes so we keep the original class
        const addClassesArray = Object.assign([], this.rollover.rolloverClasses);
        addClassesArray.unshift(image.className);
        this.addClassesToElement(image, addClassesArray);
        // No offset SET so we can just scrollIntoView
        if (this.rollover.offset == null) {
          image.scrollIntoView(options);
          break;
        }
        // Allow for Margin,Border and Padding
        this.scrollIntoViewWithOffset(this.div, image, this.rollover.offset);
        break;
      case 'mouseout':
        // We just want to remove JUST the rollover classes
        this.removeClassesFromElement(image, this.rollover.rolloverClasses);
        break;
    }
  }

  scrollIntoViewWithOffset(parent: HTMLDivElement, child: HTMLImageElement, setOffset: number ) {
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const parentHeight = parent.offsetHeight;
    const childY = child.getBoundingClientRect().top;
    const childYOT = child.offsetTop;
    const childHeight = child.height;
    const parentScroll = parent.scrollTop;
    // Is it a TOP or BOTTOM partial thumb ?
    const top = childYOT - childHeight + setOffset < parentScroll;
    const bottom = childYOT + childHeight + setOffset > parentHeight + parentScroll;
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if ( top || bottom) {
      let offset = top ? childYOT - parentScroll - setOffset : bottom ? childY - childHeight - parentHeight + setOffset   : 0;
      // Required where calc offset is larger than image
      if (offset > childHeight + setOffset) {
        offset = offset - childHeight;
      }
      parent.scrollBy({left: 0, top: offset, behavior: 'smooth' });
    }
  }

  // If a scroll-bar is present and image only part showing.
  scrollInToView(id: string) {
    this.findImage(id).scrollIntoView(options);
  }

  // Add/Remove Highlight, scroll into view if needed
  toggleStyle(id: string) {
    this.div.querySelector('.' + this.toggle.active).className = this.toggle.inactive;
    const img = this.findImage(id);
    img.className = this.toggle.active;
    img.scrollIntoView(options);
  }

  // Items added and this update the Category count
  updateImageTitle(title: string) {
    if (this.div != null) {
      this.findImage(this.lastUpdateId).parentElement.title = title;
    }
  }

  // Cannot querySelectAll by 'id' as id's don't always start with a letter, CSS requirement to use this.
  findImage(id: string): HTMLImageElement {
    const images = this.div.querySelectorAll('img');
    // Traditional FOR so can break after finding the req items
    // without needing to know what type we are looping
    // noinspection TsLint
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      if (img.id === id) {
        return img;
      }
    }
  }
}
