
import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';


// APOLLO
import { Apollo } from 'apollo-angular';
import gql from "graphql-tag";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [
    trigger('listAnimation', [
      transition('* => *', [ // each time the binding value changes
        query(':leave', [
          stagger(100, [
            animate('0.5s', style({ opacity: 0 }))
          ])
        ], { optional: true }),
        query(':enter', [
          style({ opacity: 0 }),
          stagger(100, [
            animate('0.5s', style({ opacity: 1 }))
          ])
        ], { optional: true })
      ])
    ])
  ],
})
export class HomePage {
  rates = []
  currentCurrency = "USD"
  constructor(
    public navCtrl: NavController,
    private apollo: Apollo,
    public loadingCtrl: LoadingController) {

  }

  /**
   * 
   * 
   * @param {any} _value 
   * @memberof HomePage
   */
  onCurrencyChange(_value) {
    this.currentCurrency = _value;
    this.doQuery(this.currentCurrency)
  }

  /**
   * 
   * 
   * @param {string} [currentCurrency="USD"] 
   * @memberof HomePage
   */
  doQuery(currentCurrency: string = "USD") {

    this.rates = []

    // show loading...
    let loadingDialog = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loadingDialog.present();

    this.apollo.watchQuery<any>({
      query: ExchangeRateQuery,
      variables: { "currency": currentCurrency }
    })
      .valueChanges
      .subscribe(({ data, loading, errors }) => {
        console.log(data)
        if (loading) {
          console.log("loading...")
        } else {

          let allRates = data.rates.rates

          let result = allRates.filter(
            ({ currency }) =>
              currency !== currentCurrency &&
              (["USD", "BTC", "LTC", "EUR", "JPY", "ETH"].indexOf(currency) !== -1)
          )

          loadingDialog.dismiss();
          this.rates = result
        }
      });
  }


  ngOnInit() {
    console.log("do query")

    this.doQuery(this.currentCurrency)
  }
}



const ExchangeRateQuery = gql`
  query rates($currency: String!) {
    rates(currency: $currency) {
      currency
      rates {
        currency
        rate
      }
    }
  }
`;