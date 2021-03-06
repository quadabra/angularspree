import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Taxon } from './../../../core/models/taxon';
import { environment } from '../../../../environments/environment';
import { AppState } from '../../../interfaces';
import { getTaxonomies } from '../../../product/reducers/selectors';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product';

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryPageComponent implements OnInit {
  banners = environment.config.category_banner;
  categeory_number: number;
  selectedTaxons$: Observable<Taxon>;
  productList$: Observable<Array<Product>>;
  selectedCategory: any;

  constructor(private route: ActivatedRoute,
    private store: Store<AppState>,
    private productService: ProductService) { }

  ngOnInit() {
    this.selectedTaxons$ =
      this.store.select(getTaxonomies)
        .pipe(
          switchMap(taxonomies => {
            const taxonomy = taxonomies[0];

            return this.route.params.pipe(
              map(params => {
                const categeory_number = params.number
                this.selectedCategory = this.banners[categeory_number]
                let taxons = [];
                if (taxonomy) { taxons = taxonomy.root.taxons };
                return taxons.find(taxon => taxon.name === categeory_number);
              }),
              map(selectedTaxon => {
                if (typeof selectedTaxon === 'undefined') { return of({}) };

                const taxons = selectedTaxon.taxons;

                this.productList$ = forkJoin(
                  taxons.map(taxon => this.productService.getProductsByTaxonNP(taxon.id))
                )
                return selectedTaxon;
              })
            );
          })
        );
  }

}

