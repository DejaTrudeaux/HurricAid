import { Component, OnInit } from '@angular/core';
import { MapsService } from '../service/maps.service';
import { HttpClient } from '@angular/common/http';
import { HelppinComponent } from '../helppin/helppin.component';
import { HavepinComponent } from '../havepin/havepin.component';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';
import * as moment from 'moment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;

  zoom: number = 12;
  lat: any;
  lng: any;
  markers: any = [];
  haveUrl = 'https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|4286f4';
  helpUrl = 'https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FF0000';

  constructor(
    private map: MapsService,
    private http: HttpClient,
    public dialog: MatDialog,
    private authService: AuthService) {
  }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;

    // location by browser or by ip if error or navigator unavailable
    const success = (position) => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
    }

    const error = () => {
      this.map.getLocation().subscribe(data => {
        this.lat = data.latitude;
        this.lng = data.longitude;
      });
    }

    navigator.geolocation.getCurrentPosition(success, error);

    if (!navigator.geolocation || (!this.lat && !this.lng)) {
      this.map.getLocation().subscribe(data => {
        this.lat = data.latitude;
        this.lng = data.longitude;
      });
    }
    // query all the pins from db and push to markers
    this.http.get('/getPins').subscribe((pins: any) => {
      for (let i = 0; i < pins.length; i ++) {
        this.markers.push({
          id: pins[i].id,
          help: pins[i].help,
          have: pins[i].have,
          address: pins[i].address,
          id_phone: pins[i].id_phone,
          latitude: pins[i].latitude,
          longitude: pins[i].longitude,
          message: pins[i].message,
          createdAt: moment(pins[i].createdAt).format('llll'),
          updatedAt: moment(pins[i].updatedAt).format('llll'),
        });
      }
    });
  }
  helpBox(): void {
    this.dialog.open(HelppinComponent, {
      width: '380px',
    });
  }
  haveBox(): void {
    this.dialog.open(HavepinComponent, {
      width: '380px',
    });
  }
}