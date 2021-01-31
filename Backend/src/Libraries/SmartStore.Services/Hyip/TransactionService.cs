using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SmartStore.Core;
using SmartStore.Core.Caching;
using SmartStore.Core.Data;
using SmartStore.Core.Domain.Hyip;
using SmartStore.Core.Domain.Security;
using SmartStore.Core.Domain.Stores;
using SmartStore.Data.Caching;

namespace SmartStore.Services.Hyip
{
	public partial class TransactionService : ITransactionService
	{
		private readonly IRepository<Transaction> _transactionRepository;
		private readonly IRequestCache _requestCache;
		private const string TRANSACTION_PATTERN_KEY = "transaction.*";
		public TransactionService(IRepository<Transaction> transactionRepository,
			IRepository<StoreMapping> storeMappingRepository,
			IRepository<AclRecord> aclRepository,
			IWorkContext workContext,
			IRequestCache requestCache)
		{
			_transactionRepository = transactionRepository;
			_requestCache = requestCache;
		}

		public void InsertTransaction(Transaction transaction)
		{
			Guard.NotNull(transaction, nameof(transaction));

			_transactionRepository.Insert(transaction);

			_requestCache.RemoveByPattern(TRANSACTION_PATTERN_KEY);
		}

		public void UpdateTransaction(Transaction transaction)
		{
			Guard.NotNull(transaction, nameof(transaction));

			_transactionRepository.Update(transaction);

			_requestCache.RemoveByPattern(TRANSACTION_PATTERN_KEY);
		}

		public void DeleteTransaction(Transaction transaction)
		{
			Guard.NotNull(transaction, nameof(transaction));

			transaction.Deleted = true;
			UpdateTransaction(transaction);
		}

		public Transaction GetTransactionById(int transactionid)
		{
			if (transactionid == 0)
				return null;

			return _transactionRepository.GetByIdCached(transactionid, "db.transaction.id-" + transactionid);
		}

		public Transaction GetTransactionByRefId(int RefId)
		{
			if (RefId == 0)
				return null;

			return _transactionRepository.Table.Where(x=>x.RefId == RefId && x.StatusId == 2 && x.TranscationTypeId == 7).FirstOrDefault();
		}

		public List<Transaction> GetTodaysWithdrawal(int customerid)
		{
			var transType = (int)TransactionType.Withdrawal;

			return _transactionRepository.Table.
				Where(x => x.TransactionDate.Year == DateTime.Now.Year
							&& x.TransactionDate.Month == DateTime.Now.Month
							&& x.TransactionDate.Day == DateTime.Now.Day
							&& x.TranscationTypeId == transType
							&& x.CustomerId == customerid && x.Deleted == false).ToList();
		}


		public IPagedList<Transaction> GetAllTransactions(int transactionid, int customerid, DateTime? startTime, DateTime? endTime, int[] ts, int[] tt, int pageIndex = 0, int pageSize = int.MaxValue)
		{
			var query = _transactionRepository.Table;

			if (ts != null && ts.Count() > 0)
				query = query.Where(x => ts.Contains(x.StatusId));

			if (tt != null && tt.Count() > 0)
				query = query.Where(x => tt.Contains(x.TranscationTypeId));

			if (startTime.HasValue)
				query = query.Where(o => startTime.Value <= o.TransactionDate);
			if (startTime.HasValue)
				query = query.Where(o => startTime.Value >= o.TransactionDate);

			var transactions = (from t in query
								where (transactionid == 0 || t.Id == transactionid) &&
									 (customerid == 0 || t.CustomerId == customerid) && t.Deleted == false
								select t).OrderByDescending(x => x.CreatedOnUtc);
			// Paging
			return new PagedList<Transaction>(transactions, pageIndex, pageSize);
		}

		public IPagedList<Transaction> GetAllTransactions(int transactionid, int customerid, DateTime? startTime, DateTime? endTime, int[] processorids, int[] ts, int[] tt, int pageIndex = 0, int pageSize = int.MaxValue)
		{
			var query = _transactionRepository.Table;

			if (ts != null && ts.Count() > 0)
				query = query.Where(x => ts.Contains(x.StatusId));

			if (tt != null && tt.Count() > 0)
				query = query.Where(x => tt.Contains(x.TranscationTypeId));

			if (processorids != null && processorids.Count() > 0)
				query = query.Where(x => processorids.Contains(x.ProcessorId));

			if (startTime.HasValue)
				query = query.Where(o => startTime.Value <= o.TransactionDate);
			if (startTime.HasValue)
				query = query.Where(o => startTime.Value >= o.TransactionDate);


			var transactions = (from t in query
								where (transactionid == 0 || t.Id == transactionid) &&
									 (customerid == 0 || t.CustomerId == customerid) && t.Deleted == false
								select t).OrderByDescending(x => x.CreatedOnUtc);
			// Paging
			return new PagedList<Transaction>(transactions, pageIndex, pageSize);
		}
	}
}
