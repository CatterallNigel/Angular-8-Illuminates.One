import {Component, OnInit} from '@angular/core';
import {GlobalConstants} from '../../../../shared';
import {QuotationsType} from '../../../../shared/modules/widget';

const quotesData = GlobalConstants.listofQuotes;
const changeQuotePeriod = GlobalConstants.changeQuotePeriod;
const noOfWords = GlobalConstants.quoteWordLength;

@Component({
  selector: 'app-landing-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  quotations: QuotationsType;

  constructor() {}

  ngOnInit() {
    // Load Quotations - NOW in Quotation Component - this still a valid useage
    /*
    this.http.getStaticData(quotesData).subscribe(data => {
      const quotes: QuoteType[] = data.filter( q => q.quoteText.split(' ').length <= noOfWords);
      this.quotations = {
        quotes,
        interval: changeQuotePeriod
      };
      Logger.log('Quotes: ' + Object.keys(this.quotations.quotes).length, 'HeaderComponent.ngOnInit', 28);
    });
    */
  }

  // See ABOVE - check Quote Generator for @Input() for usage
  // noinspection JSUnusedGlobalSymbols
  get getQuotes() {
    return this.quotations;
  }

  get quoteConfig() {
    return  {
      dataFile: quotesData,
      changeInterval: changeQuotePeriod,
      noOfWords
    };
  }
}
