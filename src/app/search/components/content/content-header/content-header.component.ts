import { Router } from '@angular/router';
import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectionStrategy, PLATFORM_ID, Inject } from '@angular/core';
import { LayoutState } from '../../../../layout/reducers/layout.state';

@Component({
  selector: 'app-content-header',
  templateUrl: './content-header.component.html',
  styleUrls: ['./content-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentHeaderComponent implements OnInit {
  @Output() toggleSize = new EventEmitter();
  @Input() paginationInfo;
  @Input() fillterList;
  @Input() layoutState: LayoutState;
  subselectedItem;
  childselectedItem;

  options = [
    { name: 'Newest', value: 1 },
    { name: 'Avg.Customer Review', value: 2 },
    { name: 'Most Reviews', value: 3 },
    { name: 'A To Z', value: 4 },
    { name: 'Z To A', value: 5 },
    { name: 'Relevence', value: 6 }
  ]

  queryMap = {
    Newest: 'updated_at+asc',
    'Avg.Customer Review': 'avg_rating+desc',
    'Most Reviews': 'reviews_count+desc',
    'A To Z': 'name+asc',
    'Z To A': 'name+desc',
    Relevance: '',
  }

  selectedOption = 'Relevance';
  selectedSize = 'COZY';
  searchKeyword = '';
  selectedEntry;
  isfilterModalShown;
  issortModalShown
  defaultselectedEntry = 'Relevance';
  constructor(private routernomal: Router) { }

  sortModalShow() { this.issortModalShown = true; }
  sortModalhide() { this.issortModalShown = false; }

  filterModalShow() {
    this.isfilterModalShown = true;
  }
  filterModalhide() {
    this.isfilterModalShown = false;
  }

  onSelectionChange(entry) {
    this.selectedEntry = entry;
    this.sortFilter(this.selectedEntry.name);
    this.issortModalShown = false;
    this.selectedOption = entry;
  }

  ngOnInit() {
  }

  toggleView(view) {
    this.selectedSize = view;
    this.toggleSize.emit({ size: view });
  }

  isSmallSelected(): boolean {
    return this.selectedSize === 'COZY';
  }

  isBigSelected(): boolean {
    return this.selectedSize === 'COMPACT';
  }
  fltermodelstate(flag) {
    this.isfilterModalShown = flag;
  }
  selectedInput(newVal) {
    this.subselectedItem = newVal;

  }
  childselectedInput(newVal) {
    this.childselectedItem = newVal;

  }

  sortFilter(i) {
    const urlTree = this.routernomal.createUrlTree([], {
      queryParams: { 'q[s]': this.queryMap[i] },
      queryParamsHandling: 'merge',
      preserveFragment: true,
    });
    this.routernomal.navigateByUrl(urlTree);
    this.selectedOption = i;
  }
}
