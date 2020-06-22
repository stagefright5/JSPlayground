const tscode = `
import { NPubSubService } from 'neutrinos-seed-services';
import { prospectnotesservice } from '../../sd-services/prospectnotesservice';
import { birthdaynotificationsService } from '../../services/birthdaynotifications/birthdaynotifications.service';


@Component({
    selector: 'bh-contacts',
    templateUrl: './contacts.template.html'
})

export class contactsComponent extends NBaseComponent implements OnInit {
    mm: ModelMethods;
    @Input() setPageValue;
    @Input() pagination;
    @Output() dataObj;
    @Input() searchContent;
    @Output() filterContent;
    contactSub;
    displayColumnValue = ['name', 'sur_name', 'cell_no', 'email', 'Action'];
    ColumnheaderValue = ['Name', 'Surname', 'Cell Number', 'Email', 'Action'];
    dataSource: any = [];
    prospectObj = [];
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    pageIndex: number = 1;
    tempOBj = {}


    constructor(private bdms: NDataModelService, public snackbar: snackbarService,
        private router: Router, private staticData: staticdataService,
        private dialogData: dialogService, private contactData: contactservice, private addEvents: feedbackpopupService,
        private birthdaynotifications: birthdaynotificationsService, public prospectNotes: prospectnotesservice,
        private pubSub: NPubSubService) {
        super();
        this.mm = new ModelMethods(bdms);
        this.contactSub = this.pubSub.$sub('updateContacts', () => {
            this.pageperView();
        });
    }

    ngOnInit() {
        this.dataObj = this.staticData.contactObj;
        if (this.dataObj.length == 0) {
            this.contactData.getContact().then(({ local: { result: res } }: any) => {
                this.staticData.contactObj = res.result;
                this.setDataTable(res.result);
                this.pubSub.$pub('pageView', { tablename: 'Contacts' });
            });
        }
    }

    ngOnChanges() {
        this.prospectObj = this.dataObj;
        this.setDataTable(this.prospectObj);
        // this.setpageNavigation();
        this.pageperView();
        if (this.filterContent) {
            this.prospectObj = this.searchContent;
            this.setDataTable(this.prospectObj);
        }
    }

    pageperView() {
        this.setDataTable(this.prospectObj);
        this.setpageNavigation();
    }
    setpageNavigation() {
        this.pagination.pageIndex = this.setPageValue;
        this.setDataTable(this.prospectObj);
    }

    setDataTable(Obj) {
        this.dataSource = new MatTableDataSource(Obj);
        this.dataSource.paginator = this.pagination;
        this.dataSource.sort = this.sort
    }
    continueProspect(element) {
        this.contactData.receiveContact(element);
        let temp = element['contact_id'];
        element['title'] = 'What are you interested in?';
        let button1 = {
            firstBtn: 'RISK PURCHASE',
            operation: 'navigate',
            link: \`/baseLayout/contactData/createprospect/create/${element['contact_id']}/0\`,
            value: true
        }
        let button2 = {
            secondBtn: 'INVESTMENT',
            value: false
        }
        element['button1'] = button1;
        element['button2'] = button2;

        this.dialogData.openDialog(element);
    }
    //create event
    createEvent(element) {
        element['subActions'] = 'autopopulate';
        element['relation'] = 'contact';
        this.addEvents.addEvent(element).then(res => {
        })
    }
    //edit contact
    editContact(element, index) {
        this.staticData.cont_id = element['contact_id'];
        this.staticData.contObj = Object.assign({}, element)
        this.router.navigate(['/baseLayout/contactData/createcontact', 'update', index])
	}
	
    //delete contact
    deleteContact(element, index) {
        element['title'] = 'Delete Contact?';
        let button1 = {
            firstBtn: 'YES',
            operation: 'close',
            value: true
        }
        let button2 = {
            secondBtn: 'NO',
            value: false
		}
	}

    ngOnDestroy() {
        if (this.contactSub) {
            this.contactSub.unsubscribe();
        }
    }
}`;

module.exports = {
	tscode
};
