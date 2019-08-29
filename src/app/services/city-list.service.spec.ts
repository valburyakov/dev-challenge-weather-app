import { TestBed } from '@angular/core/testing';

import { CityListService } from './city-list.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('CityListService', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CityListService]
    });

    httpMock = TestBed.get(HttpTestingController);
  });

  it('should get cities as json and unzip', () => {
    const service: CityListService = TestBed.get(CityListService);

    const testBlobResponse =  new Blob([new ArrayBuffer(4)]);
    service.getCitiesList().subscribe(res => expect(res).toEqual([]));

    httpMock.expectOne({
      url: '/assets/city.list.json.gz',
      method: 'GET'
    }).flush(testBlobResponse);

    expect(service).toBeTruthy();
  });
});
