import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { FileUploader } from 'ng2-file-upload';
const URL = 'https://your-url.com';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddProductComponent implements OnInit {
  public name;
  public expiryDate;
  public price;
  public uploader: FileUploader = new FileUploader({
    url: URL,
    isHTML5: true
  });
  imageSrc = [];
  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _coreSidebarService: CoreSidebarService) {}

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  /**
   * Submit
   *
   * @param form
   */
  submit(form) {
    if (form.valid) {
      this.toggleSidebar('new-user-sidebar');
    }
  }

  ngOnInit(): void {}
  showItem(item){
    console.log(item);
  }

  readURL(event: any): void {
    if (event.target.files ) {
      for(let i=0; i< event.target.files.length ; i++ ){
        const file = event.target.files[i];

        const reader = new FileReader();
        reader.onload = e => this.imageSrc.push(reader.result);

        reader.readAsDataURL(file);
      }
    }
}
}
