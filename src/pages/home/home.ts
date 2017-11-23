
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

// APOLLO
import { Apollo } from 'apollo-angular';
import gql from "graphql-tag";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  rates
  currentCurrency = "USD"
  constructor(public navCtrl: NavController, private apollo:Apollo) {

  }

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
  doQuery(currentCurrency : string = "USD") {
    this.apollo.watchQuery<any>({
      query: ExchangeRateQuery,
      variables: { "currency": currentCurrency }
    })
      .valueChanges
      .subscribe(({data}) => {
        console.log(data.rates)
        let allRates = data.rates.rates

        let result =  allRates.filter(
          ({ currency }) =>
            currency !== currentCurrency &&
            (["USD", "BTC", "LTC", "EUR", "JPY", "ETH"].indexOf(currency) !== -1)
        )

        this.rates = result
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