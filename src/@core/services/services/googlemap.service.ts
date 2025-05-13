import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

declare var google: any;

@Injectable({
  providedIn: "root",
})
export class GoogleMapsService {
  private geocoder: any;
  private placesService: any;

  constructor(private http: HttpClient) {
    this.geocoder = new google.maps.Geocoder();
    this.placesService = new google.maps.places.PlacesService(
      document.createElement("div")
    );
  }

  // Method to get all zip codes within a certain radius of a given zip code
  public getZipCodesInRadius(
    zipCode: string,
    radius: number
  ): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      // Get the latitude and longitude of the given zip code
      this.geocoder.geocode(
        { address: zipCode },
        (results: any[], status: any) => {
          if (status !== "OK") {
            reject(new Error(`Geocode failed: ${status}`));
          } else {
            const location = results[0].geometry.location;

            // Search for all zip codes within the given radius
            const request = {
              location: location,
              radius: radius,
              type: "postal_code",
            };
            this.placesService.nearbySearch(
              request,
              (results: any[], status: any) => {
                if (status !== "OK") {
                  reject(new Error(`Nearby search failed: ${status}`));
                } else {
                  // Extract the zip codes from the results and resolve the promise
                  const zipCodes = results.map((result) => result.postal_code);
                  resolve(zipCodes);
                }
              }
            );
          }
        }
      );
    });
  }

  public findNearbyZipcodes(
    lat: number,
    lng: number,
    radius: number
  ): Promise<string[]> {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=postal_code&key=${environment.googleMaps.apiKey}`;

    return this.http
      .get(url)
      .toPromise()
      .then((response: any) => {
        const results = response.results || [];
        const zipcodes = results.map((result: any) => result.name);
        return zipcodes;
      });
  }
}
