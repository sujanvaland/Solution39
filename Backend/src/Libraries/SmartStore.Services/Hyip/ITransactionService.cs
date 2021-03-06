﻿using SmartStore.Core;
using SmartStore.Core.Domain.Hyip;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartStore.Services.Hyip
{
	public partial interface ITransactionService
	{
		void InsertTransaction(Transaction transaction);
		void UpdateTransaction(Transaction transaction);
		void DeleteTransaction(Transaction transaction);
		Transaction GetTransactionById(int transactionid);
		List<Transaction> GetTodaysWithdrawal(int customerid);
		Transaction GetTransactionByRefId(int RefId);
		IPagedList<Transaction> GetAllTransactions(int transactionid, int customerid, DateTime? startTime, DateTime? endTime, int[] processorids, int[] ts, int[] tt, int pageIndex = 0, int pageSize = int.MaxValue);
		IPagedList<Transaction> GetAllTransactions(int transactionid, int customerid, DateTime? startTime, DateTime? endTime, int[] ts, int[] tt, int pageIndex = 0, int pageSize = int.MaxValue);
	}
}
