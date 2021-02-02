using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SmartStore.Core;
using SmartStore.Core.Domain.Common;
using SmartStore.Core.Domain.Customers;
using SmartStore.Core.Domain.Forums;
using SmartStore.Core.Domain.Localization;
using SmartStore.Core.Domain.Media;
using SmartStore.Core.Domain.Orders;
using SmartStore.Core.Domain.Tax;
using SmartStore.Core.Localization;
using SmartStore.Core.Logging;
using SmartStore.Services;
using SmartStore.Services.Authentication;
using SmartStore.Services.Authentication.External;
using SmartStore.Services.Catalog;
using SmartStore.Services.Common;
using SmartStore.Services.Customers;
using SmartStore.Services.Directory;
using SmartStore.Services.Helpers;
using SmartStore.Services.Localization;
using SmartStore.Services.Media;
using SmartStore.Services.Messages;
using SmartStore.Services.Security;
using SmartStore.Services.Tax;
using SmartStore.Web.Framework.Plugins;
using SmartStore.WebApi.Models.Api.Customer;
using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using SmartStore.Core.Domain.Hyip;
using System.Web.Mvc;
using System.Collections.Generic;
using SmartStore.Services.Boards;
using SmartStore.Services.Hyip;
using SmartStore.Admin.Models.Investment;
using SmartStore.Admin;

namespace SmartStore.WebApi.Controllers.Api
{
    public class MatrixController : ApiController
    {
        #region Fields
        public Localizer T { get; set; }//Added by Yagnesh 
        public ICommonServices Services { get; set; }//Added by Yagnesh 
		private readonly ICommonServices _services;
        private readonly IAuthenticationService _authenticationService;
        private readonly IDateTimeHelper _dateTimeHelper;
        private readonly DateTimeSettings _dateTimeSettings;
        private readonly ILocalizationService _localizationService;
        private readonly IWorkContext _workContext;
        private readonly IStoreContext _storeContext;
        private readonly ICustomerService _customerService;
        private readonly IGenericAttributeService _genericAttributeService;
        private readonly ICustomerRegistrationService _customerRegistrationService;
        private readonly ITaxService _taxService;
        private readonly CustomerSettings _customerSettings;
        private readonly ICurrencyService _currencyService;
        private readonly IPriceFormatter _priceFormatter;
        private readonly IPictureService _pictureService;
        private readonly IOpenAuthenticationService _openAuthenticationService;
        private readonly IDownloadService _downloadService;
        private readonly IWebHelper _webHelper;
        private readonly ICustomerActivityService _customerActivityService;
        private readonly MediaSettings _mediaSettings;
        private readonly LocalizationSettings _localizationSettings;
        private readonly ExternalAuthenticationSettings _externalAuthenticationSettings;
        private readonly PluginMediator _pluginMediator;
        private readonly IPermissionService _permissionService;
		private readonly INewsLetterSubscriptionService _newsLetterSubscriptionService;
		private readonly IBoardService _boardService;
		private readonly IPlanService _planService;
		private readonly ICustomerPlanService _customerPlanService;
		private readonly ITransactionService _transactionService;
		#endregion

		#region Ctor

		public MatrixController(
			ITransactionService transactionService,
			ICustomerPlanService customerPlanService,
			IPlanService planService,
			ICommonServices services,
            IAuthenticationService authenticationService,
            IDateTimeHelper dateTimeHelper,
            DateTimeSettings dateTimeSettings, TaxSettings taxSettings,
            ILocalizationService localizationService,
            IWorkContext workContext, IStoreContext storeContext,
            ICustomerService customerService,
            IGenericAttributeService genericAttributeService,
            ICustomerRegistrationService customerRegistrationService,
            ITaxService taxService, RewardPointsSettings rewardPointsSettings,
            CustomerSettings customerSettings, AddressSettings addressSettings, ForumSettings forumSettings,
            ICurrencyService currencyService,
            IPriceFormatter priceFormatter,
            IPictureService pictureService, INewsLetterSubscriptionService newsLetterSubscriptionService,
            ICustomerActivityService customerActivityService,
            MediaSettings mediaSettings,
            LocalizationSettings localizationSettings,
            ExternalAuthenticationSettings externalAuthenticationSettings,
            PluginMediator pluginMediator,
            IPermissionService permissionService,
			IBoardService boardService)
        {
			_planService = planService;
			_customerPlanService = customerPlanService;
			_transactionService = transactionService;
			_services = services;
            _authenticationService = authenticationService;
            _dateTimeHelper = dateTimeHelper;
            _dateTimeSettings = dateTimeSettings;
            _localizationService = localizationService;
            _workContext = workContext;
            _storeContext = storeContext;
            _customerService = customerService;
            _genericAttributeService = genericAttributeService;
            _customerRegistrationService = customerRegistrationService;
            _taxService = taxService;
            _customerSettings = customerSettings;
            _currencyService = currencyService;
            _priceFormatter = priceFormatter;
            _pictureService = pictureService;
            _newsLetterSubscriptionService = newsLetterSubscriptionService;
            _customerActivityService = customerActivityService;
            _mediaSettings = mediaSettings;
            _localizationSettings = localizationSettings;
            _externalAuthenticationSettings = externalAuthenticationSettings;
            _pluginMediator = pluginMediator;
            _permissionService = permissionService;
			_boardService = boardService;

		}

		#endregion

		[System.Web.Http.HttpGet]
		[System.Web.Http.ActionName("GetMatrixPlan")]
		public HttpResponseMessage GetMatrixPlan()
		{
			var response = this.Request.CreateResponse(HttpStatusCode.OK);
			try
			{
				var boards = _boardService.GetAllBoards().OrderBy(x => x.Id);
				return Request.CreateResponse(HttpStatusCode.OK, new { code = 0, Message = "success", data = boards });
			}
			catch (Exception ex)
			{
				return Request.CreateResponse(HttpStatusCode.OK, new { code = 0, Message = _localizationService.GetResource("Common.SomethingWentWrong") });
			}
		}

		[System.Web.Http.HttpPost]
		[System.Web.Http.ActionName("BuyPosition")]
		public HttpResponseMessage BuyPosition(CustomerPlanModel customerPlanModel)
		{
			try
			{
				var Customer = _customerService.GetCustomerById(customerPlanModel.CustomerId);
				if (ModelState.IsValid)
				{
					if (customerPlanModel.PlanId > 0)
					{
						var plan = _boardService.GetBoardById(customerPlanModel.PlanId);
						var repurchasebalance = _customerService.GetAvailableBalance(Customer.Id);
						var amountreq = Convert.ToInt64(plan.Price) * ((customerPlanModel.NoOfPosition == 0) ? 1 : customerPlanModel.NoOfPosition);
						
						if (repurchasebalance < amountreq)
						{
							return Request.CreateResponse(HttpStatusCode.OK, new { code = 0, Message = "You do not have enough balance" });
						}
						
						if (customerPlanModel.NoOfPosition <= 0)
						{
							return Request.CreateResponse(HttpStatusCode.OK, new { code = 0, Message = "Enter correct amount" });
						}

						TransactionModel transactionModel = new TransactionModel();
						transactionModel.Amount = amountreq;
						transactionModel.CustomerId = Customer.Id;
						transactionModel.FinalAmount = transactionModel.Amount;
						transactionModel.NoOfPosition = customerPlanModel.NoOfPosition;
						transactionModel.TransactionDate = DateTime.Now;
						transactionModel.RefId = plan.Id;
						transactionModel.ProcessorId = customerPlanModel.ProcessorId;
						transactionModel.TranscationTypeId = (int)TransactionType.Purchase;
						var transcation = transactionModel.ToEntity();
						transcation.NoOfPosition = customerPlanModel.NoOfPosition;
						if (customerPlanModel.ProcessorId == 5)
						{
							transcation.TranscationTypeId = (int)TransactionType.Purchase;
							transcation.StatusId = (int)Status.Completed;
						}
						else
						{
							transcation.StatusId = (int)Status.Pending;
							transcation.TranscationTypeId = (int)TransactionType.Purchase;
						}
						_transactionService.InsertTransaction(transcation);

						for (int i = 0; i < customerPlanModel.NoOfPosition; i++)
						{
							ReleaseLevelCommission(plan.Id, Customer);
						}
						
						return Request.CreateResponse(HttpStatusCode.OK, new { code = 0, Message = "success" });
					}
					else
					{
						return Request.CreateResponse(HttpStatusCode.OK, new { code = 0, Message = "Please select Board" });
					}
				}
			}
			catch (Exception ex)
			{
				return Request.CreateResponse(HttpStatusCode.OK, new { code = 0, Message = T("Invesment.Deposit.FundingError") });
			}
			return Request.CreateResponse(HttpStatusCode.OK, new { code = 0, Message = "something went wrong" });
		}

		public void ReleaseLevelCommission(int planid, Customer customer)
		{
			//Save board position
			int customerid = customer.Id;
			_customerService.SaveCusomerPosition(customerid, planid);
			Services.MessageFactory.SendCustomerMembershipActivation(customer, _localizationSettings.DefaultAdminLanguageId);
		}

		[System.Web.Http.HttpPost]
		[System.Web.Http.ActionName("GetTreeView")]
		public HttpResponseMessage GetTreeView(int PositionId)
		{
			var boards = _boardService.GetTreeView(PositionId);
			return Request.CreateResponse(HttpStatusCode.OK, new { code = 0, Message = "success", data = boards });

		}

		[System.Web.Http.HttpPost]
		[System.Web.Http.ActionName("AddTransaction")]
		public HttpResponseMessage AddTransaction(TransactionModel transactionModel)
		{
			var customerguid = Request.Headers.GetValues("CustomerGUID").FirstOrDefault();
			if (customerguid != null)
			{
				var cust = _customerService.GetCustomerByGuid(Guid.Parse(customerguid));
				if (transactionModel.CustomerId != cust.Id)
				{
					return Request.CreateResponse(HttpStatusCode.Unauthorized, new { code = 0, Message = "something went wrong" });
				}
			}
			transactionModel.TransactionDate = DateTime.Now;
			var transcation = transactionModel.ToEntity();
			transcation.NoOfPosition = transactionModel.NoOfPosition;
			transcation.StatusId = (int)Status.Pending;
			transcation.TranscationTypeId = transactionModel.TranscationTypeId;
			_transactionService.InsertTransaction(transcation);
			return Request.CreateResponse(HttpStatusCode.OK, new { code = 0, Message = "success", data = new { Id = transcation.Id } });
		}
	}
}