import { Component, Input } from '@angular/core';
import { GalleryService } from 'src/app/services/configuration/gallery.service';
declare const $: any;

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent {
  @Input() images: string[];
  url: string;

  constructor(private galleryService: GalleryService) { }

  open(url: string): void {
    this.url = url;
    $('#imageModal').modal('show');
  }

  delete(): void {
    this.galleryService.deleteByUrl(this.url).then(() => {
      $('#imageModal').modal('hide');
      const index = this.images.indexOf(this.url);
      this.images.splice(index, 1);
    });
  }

  close(): void {
    $('#imageModal').modal('hide');
  }
}
