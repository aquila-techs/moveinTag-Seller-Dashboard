import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { UserService } from '@core/services/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-verifications',
  templateUrl: './verifications.component.html',
  styleUrls: ['./verifications.component.scss']
})
export class VerificationsComponent implements OnInit {

  public baseURL: any = environment.serverURL;

  constructor(private userService: UserService, private toastrService: ToastrService) {
    this.userId = JSON.parse(window.localStorage.getItem('currentUser'))._id;
  }

  public userId = '';
  public sellerProfile: any;

  public LisenceExtension: "";
  public LisenceURL: "";

  public LibilityInsuranceExtension: "";
  public LibilityInsuranceURL: "";

  public IdentityCardExtension: "";
  public IdentityCardURL: "";

  licensePhotoChangedEvent: any = '';
  licensePhotoChangedEventTYPE: any = '';
  libilityInsurancePhotoChangedEvent: any = '';
  libilityInsurancePhotoChangedEventTYPE: any = '';
  IdentityCardPhotoChangedEvent: any = '';
  IdentityCardPhotoChangedEventTYPE: any = '';

  get_url_extension(url) {
    return url.split(/[#?]/)[0].split('.').pop().trim();
  }

  ngOnInit(): void {
    this.getUserProfile()
  }

  getUserProfile() {
    this.userService.getProfile(this.userId).subscribe({
      next: (res: any) => {

        this.sellerProfile = res;

        this.LisenceURL = res.license;
        this.LibilityInsuranceURL = res.libilityInsurance;
        this.IdentityCardURL = res.IdentityCard;

      }
    })
  }

  licensefileChangeEvent(event: any): void {

    if (event.target.files[0].type === "application/pdf" || event.target.files[0].type === "image/jpeg" || event.target.files[0].type === "image/png") {

      let data: FormData = new FormData();
      data.append('license', event.target.files[0])
      data.append('id', this.userId)
      this.userService.updateSellerLicense(data).subscribe({
        next: (res) => {
          this.toastrService.success('File has been updated!')
          this.getUserProfile()
        },
        error: (err) => {
          this.getUserProfile()
        },
      })
      return;
    } else {
      this.toastrService.error('Please select correct format of file (PDF, PNG, JPG)')
    }

  }

  libilityInsurancefileChangeEvent(event: any): void {

    if (event.target.files[0].type === "application/pdf" || event.target.files[0].type === "image/jpeg" || event.target.files[0].type === "image/png") {
      let data: FormData = new FormData();
      data.append('libilityInsurance', event.target.files[0])
      data.append('id', this.userId)
      this.userService.updateSellerLibilityInsurance(data).subscribe({
        next: (res) => {
          this.toastrService.success('File has been updated!')
          this.getUserProfile()
        },
        error: (err) => {
          this.getUserProfile()
        },
      })
      return;
    } else {
      this.toastrService.error('Please select correct format of file (PDF, PNG, JPG)')
    }

  }

  IdentityCardfileChangeEvent(event: any): void {

    if (event.target.files[0].type === "application/pdf" || event.target.files[0].type === "image/jpeg" || event.target.files[0].type === "image/png") {
      let data: FormData = new FormData();
      data.append('IdentityCard', event.target.files[0])
      data.append('id', this.userId)
      this.userService.updateSellerIdentityCard(data).subscribe({
        next: (res) => {
          this.toastrService.success('File has been updated!')
          this.getUserProfile()
        },
        error: (err) => {
          this.getUserProfile()
        },
      })
      return;
    } else {
      this.toastrService.error('Please select correct format of file (PDF, PNG, JPG)')
    }

  }


  openLicense() {
    if (this.LisenceURL == undefined || this.LisenceURL == "") {
      return;
    }
    window.open(this.baseURL + this.LisenceURL, '_blank');
  }
  openLibilityInsurance() {
    if (this.LibilityInsuranceURL == undefined || this.LibilityInsuranceURL == "") {
      return;
    }
    window.open(this.baseURL + this.LibilityInsuranceURL, '_blank');
  }
  openIdentityCard() {
    if (this.IdentityCardURL == undefined || this.IdentityCardURL == "") {
      return;
    }
    window.open(this.baseURL + this.IdentityCardURL, '_blank');
  }
}
