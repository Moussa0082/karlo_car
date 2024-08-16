import { Component, OnInit, ViewChild } from '@angular/core';
import * as ApexCharts from 'apexcharts';
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexFill,
  ApexXAxis,
  ApexGrid
} from 'ng-apexcharts';
import { ReservationService } from 'src/app/services/reservation.service';
import { VenteService } from 'src/app/services/vente.service';


export interface activeusercardChartOptions {
  series: ApexAxisChartSeries;
  dataLabels: ApexDataLabels;
  chart: ApexChart;
  legend: ApexLegend;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  stroke: ApexStroke;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  tooltip: ApexTooltip;
}


@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],

})
export class SalesComponent implements OnInit{

  @ViewChild("activeusercardchart") chart1: ChartComponent = Object.create(null);
  public activeusercardChartOptions !: Partial<activeusercardChartOptions> | any;

  totalVenduParMoi: any[] = []; // Utilisez un tableau pour stocker les totaux de ventes
  totalLocationParMoi: any[] = []; // Utilisez un tableau pour stocker les totaux de locations
 


  constructor(private reservationService: ReservationService, private venteservice:VenteService) {
    // active users
    // this.activeusercardChartOptions = {
    //   series: [
    //     {
    //       name: 'Ample Admin',
    //       data: [355, 390, 300, 350, 390, 180, 355, 390, 300, 350, 390, 180],
    //       color: "#fb9678",
    //     },
    //     {
    //       name: 'Pixel Admin',
    //       data: [280, 250, 325, 215, 250, 310, 280, 250, 325, 215, 250, 310],
    //       color: "#03c9d7",
    //     },
    //   ],
    //   xaxis: {
    //     categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    //   },
    //   chart: {
    //     toolbar: {
    //       show: false,
    //     },
    //     type: 'bar',
    //     height: 300,

    //   },
    //   legend: {
    //     show: false,
    //   },

    //   tooltip: {
    //     theme: "dark"
    //   },

    //   grid: {
    //     show: false,
    //   },

    //   dataLabels: {
    //     enabled: false,
    //   },

    //   stroke: {
    //     show: true,
    //     width: 5,
    //     colors: ['none']
    //   },

    //   plotOptions: {
    //     bar: {
    //       columnWidth: '45%',
    //       borderRadius: 6,
    //     },
    //   },
    // }
  }

  ngOnInit(): void {  
    this.loadChartData();
  }

  

    loadChartData() {
    this.venteservice.getTotalSalesByMonth().subscribe(data => {
      this.totalVenduParMoi = this.extractDataFromMap(data);
      console.log("ventes ,", this.totalVenduParMoi);
      this.updateChart();
    });

    this.reservationService.getTotalReservationByMonth().subscribe(data => {
      this.totalLocationParMoi = this.extractDataFromMap(data);
      console.log("locations ,", this.totalLocationParMoi);
      this.updateChart();
    });
  }

  extractDataFromMap(data: any, totalMonths: number = 12): number[] {
    // Initialize an array with zeros for each month of the year
    const dataArr: number[] = new Array(totalMonths).fill(0);
    
    // Fill the array with available data
    Object.keys(data).forEach(key => {
      const index = parseInt(key.substring(5), 10) - 1; // Extract month index
      if (!isNaN(index) && index < totalMonths) {
        dataArr[index] = Number(data[key]);
      }
    });
    
    return dataArr;
  }
  
  // extractDataFromMap(data: any): any[] {
  //   const dataArr: any[] = [];
  //   for (const key in data) {
  //     if (data.hasOwnProperty(key)) {
  //       dataArr.push(data[key]);
  //     }
  //   }
  //   return dataArr;
  // }

  updateChart() {
    this.activeusercardChartOptions = {
      series: [
        {
          name: 'Ventes',
          data: this.totalVenduParMoi,
          color: "#03c9d7",
        },
        {
          name: 'Locations',
          data: this.totalLocationParMoi,
          color: "#fb9678",
        },
      ],
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      },
      chart: {
        toolbar: {
          show: false,
        },
        type: 'bar',
        height: 300,
      },
      legend: {
        show: true,
      },
      tooltip: {
        theme: "dark"
      },
      grid: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 5,
        colors: ['none']
      },
      plotOptions: {
        bar: {
          horizontal: false, // Assurez-vous que c'est bien vertical
          columnWidth: '45%',
          borderRadius: 6,
        },
      },
    };

    if (this.chart1) {
      this.chart1.updateOptions(this.activeusercardChartOptions);
    }
  }
 
  


}
