import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Logger} from '../../../utilities/logger';
import {QuotationConfigType, QuotationsType, QuoteType} from '../../../models/common-model';
import {WidgetConstants} from '../../../config/widget-constants';
import {WidgetService} from '../../../services/widget.service';


const changeQuotePeriod = WidgetConstants.changeQuotePeriod == null ? 10000 : WidgetConstants.changeQuotePeriod;
const defaultQuote = WidgetConstants.headerQuotes == null ? 'Your quote goes here' : WidgetConstants.headerQuotes;
const authorUnknown = WidgetConstants.authorUnknownQuote == null ? 'Unknown' :  WidgetConstants.authorUnknownQuote;

@Component({
  selector: 'app-quote-gen',
  templateUrl: './quote-gen.component.html',
  styleUrls: ['./quote-gen.component.less']
})
export class QuoteGenComponent implements OnInit, AfterViewInit {

  @ViewChild('quote', { static: false}) quoteDiv: ElementRef;

  @Input()
  set displayQuotes(quotes: QuotationsType) {
    if (quotes != null) {
      if (this.quotations == null || JSON.stringify(this.quotations) !== JSON.stringify(quotes)) {
        this.quotations = quotes;
        if (quotes.interval != null) {
          this.interval = quotes.interval;
        }
      }
    }
  }

  @Input()
  set quotationConfig(config: QuotationConfigType) {
    if (this.quoteData == null || this.quoteData !== config.dataFile ||
      this.interval !== config.changeInterval || this.noOfWords !== config.noOfWords ) {
      Logger.log('Quote Config is: ' + JSON.stringify(config), 'QuoteGenComponent.quotationConfig', 36);
      this.quoteData = config.dataFile;
      this.interval = config.changeInterval;
      this.noOfWords = config.noOfWords;
      this.class = config.class != null ? config.class : undefined;
      this.loadQuotesFromData();
    }
  }

  quoteData: string;
  noOfWords: number;
  quotations: QuotationsType;
  quote: string;
  interval: number = changeQuotePeriod;
  class: string;

  constructor(private ws: WidgetService) {
  }

  ngOnInit() {
    this.quote = defaultQuote; // default
    this.generateQuote();
  }

  ngAfterViewInit() {
    if (this.class != null) {
      const div: HTMLDivElement = this.quoteDiv.nativeElement;
      div.className = this.class;
    }
  }

  async loadQuotesFromData() {
    // Load Quotations
    await this.ws.action.getStaticData(this.quoteData).subscribe(data => {
      const quotes: QuoteType[] = data.filter( q => q.quoteText.split(' ').length <= this.noOfWords);
      this.quotations = {
        quotes,
        interval: this.interval,
      };
      Logger.log('Quotes: ' + Object.keys(this.quotations.quotes).length, 'QuoteGenComponent.loadQuotesFromData', 76);
      this.generateQuote();
    });
  }

  get getQuote() {
    return this.quote;
  }

  getAnotherQuote() {
    setTimeout(() => {
      this.generateQuote();
    }, this.interval);
  }

  generateQuote() {
    try {
      if (this.quotations != null) {
        const quoteNo = Math.floor(Math.random() * (Object.keys(this.quotations.quotes).length - 1));
        const selectedQuote = this.quotations.quotes[quoteNo];
        const author = selectedQuote.quoteAuthor == null ||
              selectedQuote.quoteAuthor.length === 0 ? authorUnknown : selectedQuote.quoteAuthor;
        this.quote = selectedQuote.quoteText + ' | ' + author;
        // Logger.log('This quote is: ' + this.quote, 'QuoteGenComponent.generateQuote', 98);
      }
    } catch (e) {
      Logger.error('Quote Error: ' + e.message, 'QuoteGenComponent.generateQuote', 102);
    }
    this.getAnotherQuote();
  }
}
