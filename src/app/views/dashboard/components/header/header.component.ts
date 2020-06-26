import {Component, OnInit} from '@angular/core';
import {UserDataService} from '../../../../shared/services';
import {UserMetaDataType} from '../../../../shared/models';
import {Logger} from '../../../../shared/classes';


@Component({
  selector: 'app-dash-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  metadata: UserMetaDataType;

  constructor(private data: UserDataService) { }

  ngOnInit() {
    this.data.getCurrentData.subscribe(data => {
      this.metadata = data;
      if ( this.metadata !== undefined) {
        // noinspection TsLint
        this.hasMetadata;
      }
    });
  }

  get hasMetadata() {
    return Logger.log('Header Metadata : ' + this.metadata.noOfTargets);
  }

  get noOfTargets(): number {
    let result = 0;
    if ( this.metadata !== undefined) {
      result = this.metadata.noOfTargets;
    }
    return result;
  }

  get noOfItems(): number {
    if ( this.metadata !== undefined) {
      let count = 0;
      this.metadata.fileInfo.forEach(fi => {
        count += fi.fileInfos.length;
      });
      return count;
    }
    return 0;
  }
}
