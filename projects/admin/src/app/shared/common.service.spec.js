"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var common_service_1 = require("./common.service");
describe('CommonService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [common_service_1.CommonService]
        });
    });
    it('should be created', testing_1.inject([common_service_1.CommonService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=common.service.spec.js.map