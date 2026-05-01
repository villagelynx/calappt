(function () {
  const STORAGE_KEYS = {
    customers: "coach_appointment_calendar_customers",
    sports: "coach_appointment_calendar_sports",
    tasks: "coach_appointment_calendar_tasks",
    appointments: "coach_appointment_calendar_appointments",
    weatherCity: "coach_appointment_calendar_weather_city",
    userEmail: "coach_appointment_calendar_user_email",
    autoBackups: "coach_appointment_calendar_auto_backups",
    autoBackupEnabled: "coach_appointment_calendar_auto_backup_enabled",
    leftMode: "coach_appointment_calendar_left_mode",
    selectedCustomerId: "coach_appointment_calendar_selected_customer_id",
    mobileViewMode: "coach_appointment_calendar_mobile_view_mode",
    statementMonth: "coach_appointment_calendar_statement_month",
    statementYear: "coach_appointment_calendar_statement_year"
  };

  const DEMO_KEYS = {
    disabled: "coach_appointment_calendar_demo_disabled"
  };

  const DEFAULT_CUSTOMERS = [
    { id: "c1", name: "Ava Reynolds", sportId: "s1", cell: "604-555-0141", email: "ava.reynolds@example.com", note: "Tuesday serve tune-up", isSample: true },
    { id: "c2", name: "Mason Carter", sportId: "s1", cell: "604-555-0177", email: "mason.carter@example.com", note: "Beginner forehand block", isSample: true },
    { id: "c3", name: "Lila Thompson", sportId: "s2", cell: "604-555-0128", email: "lila.thompson@example.com", note: "Private footwork session", isSample: true },
    { id: "c4", name: "Noah Patel", sportId: "s3", cell: "604-555-0194", email: "noah.patel@example.com", note: "Match prep lesson", isSample: true },
    { id: "c5", name: "Chloe Nguyen", sportId: "s4", cell: "604-555-0116", email: "chloe.nguyen@example.com", note: "Backhand confidence rebuild", isSample: true },
    { id: "c6", name: "Ethan Brooks", sportId: "s1", cell: "604-555-0182", email: "ethan.brooks@example.com", note: "Junior high-performance hour", isSample: true }
  ];
  const DEFAULT_SPORTS = [
    { id: "s1", name: "Tennis", iconKey: "tennis", color: "#49dcb1" },
    { id: "s2", name: "Pickleball", iconKey: "pickleball", color: "#8fd4ff" },
    { id: "s3", name: "Soccer", iconKey: "soccer", color: "#ffb84d" },
    { id: "s4", name: "Basketball", iconKey: "basketball", color: "#f4845f" }
  ];
  const SPORT_ICON_CHOICES = [
    { value: "tennis", label: "Tennis" },
    { value: "pickleball", label: "Pickleball" },
    { value: "soccer", label: "Soccer" },
    { value: "basketball", label: "Basketball" },
    { value: "baseball", label: "Baseball" },
    { value: "hockey", label: "Hockey" },
    { value: "swim", label: "Swimming" },
    { value: "fitness", label: "Fitness" }
  ];
  const TASK_COLOR = "#8fd4ff";
  const DRAWER_NEW_CUSTOMER_VALUE = "__new_customer__";
  const MOBILE_BREAKPOINT = 780;
  const mobileMediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
  const MOBILE_VIEW_MODES = {
    day: "day",
    week: "week",
    month: "month",
    agenda: "agenda"
  };

  const SCHEDULE_START_MINUTES = 6 * 60;
  const SCHEDULE_END_MINUTES = 22 * 60;
  const SLOT_MINUTES = 30;
  const SLOT_HEIGHT = 34;
  const TIME_OPTIONS = buildTimeOptions(SCHEDULE_START_MINUTES, SCHEDULE_END_MINUTES, SLOT_MINUTES);
  const SCHEDULE_SLOTS = buildTimeOptions(SCHEDULE_START_MINUTES, SCHEDULE_END_MINUTES - SLOT_MINUTES, SLOT_MINUTES);
  const AUTO_BACKUP_MAX = 12;
  const AUTO_BACKUP_DEBOUNCE_MS = 2500;
  const AUTO_BACKUP_MIN_INTERVAL_MS = 2 * 60 * 1000;

  const elements = {
    prevWeekBtn: document.getElementById("prevWeekBtn"),
    nextWeekBtn: document.getElementById("nextWeekBtn"),
    todayBtn: document.getElementById("todayBtn"),
    todayDayBtn: document.getElementById("todayDayBtn"),
    desktopDayViewBtn: document.getElementById("desktopDayViewBtn"),
    desktopWeekViewBtn: document.getElementById("desktopWeekViewBtn"),
    desktopMonthViewBtn: document.getElementById("desktopMonthViewBtn"),
    manageBtn: document.getElementById("manageBtn"),
    sidebarBackupsBtn: document.getElementById("sidebarBackupsBtn"),
    agendaBtn: document.getElementById("agendaBtn"),
    mobileAgendaBtn: document.getElementById("mobileAgendaBtn"),
    mobilePrevWeekBtn: document.getElementById("mobilePrevWeekBtn"),
    mobileWeekTitle: document.getElementById("mobileWeekTitle"),
    mobileNextWeekBtn: document.getElementById("mobileNextWeekBtn"),
    mobilePrevNavBtn: document.getElementById("mobilePrevNavBtn"),
    mobileNextNavBtn: document.getElementById("mobileNextNavBtn"),
    mobileWeekCityLabel: document.getElementById("mobileWeekCityLabel"),
    mobileWeekWeatherBadge: document.getElementById("mobileWeekWeatherBadge"),
    addBtn: document.getElementById("addBtn"),
    menuBtn: document.getElementById("menuBtn"),
    menuPrevWeekBtn: document.getElementById("menuPrevWeekBtn"),
    menuNextWeekBtn: document.getElementById("menuNextWeekBtn"),
    emailAgendaBtn: document.getElementById("emailAgendaBtn"),
    emailFeaturesBtn: document.getElementById("emailFeaturesBtn"),
    exportBackupBtn: document.getElementById("exportBackupBtn"),
    shareBackupBtn: document.getElementById("shareBackupBtn"),
    importBackupInput: document.getElementById("importBackupInput"),
    mergeBackupInput: document.getElementById("mergeBackupInput"),
    exportGoogleBtn: document.getElementById("exportGoogleBtn"),
    exportMonthlyStatementBtn: document.getElementById("exportMonthlyStatementBtn"),
    exportYearlyStatementBtn: document.getElementById("exportYearlyStatementBtn"),
    monthPrevBtn: document.getElementById("monthPrevBtn"),
    monthLabel: document.getElementById("monthLabel"),
    monthNextBtn: document.getElementById("monthNextBtn"),
    weekLabel: document.getElementById("weekLabel"),
    desktopCityLabel: document.getElementById("desktopCityLabel"),
    desktopWeatherBadge: document.getElementById("desktopWeatherBadge"),
    leftPanelEyebrow: document.getElementById("leftPanelEyebrow"),
    showCustomersBtn: document.getElementById("showCustomersBtn"),
    showTasksBtn: document.getElementById("showTasksBtn"),
    customerModeSection: document.getElementById("customerModeSection"),
    taskModeSection: document.getElementById("taskModeSection"),
    customerForm: document.getElementById("customerForm"),
    customerEditId: document.getElementById("customerEditId"),
    customerFirstName: document.getElementById("customerFirstName"),
    customerSurname: document.getElementById("customerSurname"),
    customerCell: document.getElementById("customerCell"),
    customerEmail: document.getElementById("customerEmail"),
    customerNote: document.getElementById("customerNote"),
    customerSportId: document.getElementById("customerSportId"),
    customerSubmitBtn: document.getElementById("customerSubmitBtn"),
    customerCancelBtn: document.getElementById("customerCancelBtn"),
    customerDeleteBtn: document.getElementById("customerDeleteBtn"),
    sportForm: document.getElementById("sportForm"),
    sportEditId: document.getElementById("sportEditId"),
    sportName: document.getElementById("sportName"),
    sportIconKey: document.getElementById("sportIconKey"),
    sportColor: document.getElementById("sportColor"),
    sportSubmitBtn: document.getElementById("sportSubmitBtn"),
    sportCancelBtn: document.getElementById("sportCancelBtn"),
    sportDeleteBtn: document.getElementById("sportDeleteBtn"),
    sportTable: document.getElementById("sportTable"),
    sportCountChip: document.getElementById("sportCountChip"),
    customerPicker: document.getElementById("customerPicker"),
    customerList: document.getElementById("customerList"),
    customerCountChip: document.getElementById("customerCountChip"),
    taskForm: document.getElementById("taskForm"),
    taskEditId: document.getElementById("taskEditId"),
    taskName: document.getElementById("taskName"),
    taskSubmitBtn: document.getElementById("taskSubmitBtn"),
    taskCancelBtn: document.getElementById("taskCancelBtn"),
    taskDeleteBtn: document.getElementById("taskDeleteBtn"),
    taskPicker: document.getElementById("taskPicker"),
    taskList: document.getElementById("taskList"),
    weatherForm: document.getElementById("weatherForm"),
    weatherCity: document.getElementById("weatherCity"),
    weatherStatus: document.getElementById("weatherStatus"),
    desktopCustomerPanel: document.getElementById("desktopCustomerPanel"),
    desktopAddCustomerBtn: document.getElementById("desktopAddCustomerBtn"),
    desktopAddEventBtn: document.getElementById("desktopAddEventBtn"),
    desktopNewCustomerBtn: document.getElementById("desktopNewCustomerBtn"),
    desktopCustomerList: document.getElementById("desktopCustomerList"),
    mobileDayBar: document.getElementById("mobileDayBar"),
    mobilePrevDayBtn: document.getElementById("mobilePrevDayBtn"),
    mobileDayLabel: document.getElementById("mobileDayLabel"),
    mobileCurrentTime: document.getElementById("mobileCurrentTime"),
    mobileDayHint: document.getElementById("mobileDayHint"),
    mobileNextDayBtn: document.getElementById("mobileNextDayBtn"),
    mobileViewKicker: document.getElementById("mobileViewKicker"),
    mobileViewSelect: document.getElementById("mobileViewSelect"),
    mobileCityLabel: document.getElementById("mobileCityLabel"),
    mobileDayViewBtn: document.getElementById("mobileDayViewBtn"),
    mobileWeekViewBtn: document.getElementById("mobileWeekViewBtn"),
    mobileMonthViewBtn: document.getElementById("mobileMonthViewBtn"),
    calendarGrid: document.getElementById("calendarGrid"),
    drawerOverlay: document.getElementById("drawerOverlay"),
    manageDrawer: document.getElementById("manageDrawer"),
    closeManageDrawerBtn: document.getElementById("closeManageDrawerBtn"),
    menuDrawer: document.getElementById("menuDrawer"),
    closeMenuDrawerBtn: document.getElementById("closeMenuDrawerBtn"),
    appointmentDrawer: document.getElementById("appointmentDrawer"),
    closeDrawerBtn: document.getElementById("closeDrawerBtn"),
    cancelAppointmentBtn: document.getElementById("cancelAppointmentBtn"),
    deleteAppointmentBtn: document.getElementById("deleteAppointmentBtn"),
    appointmentForm: document.getElementById("appointmentForm"),
    appointmentId: document.getElementById("appointmentId"),
    appointmentEntryType: document.getElementById("appointmentEntryType"),
    appointmentCustomerId: document.getElementById("appointmentCustomerId"),
    appointmentEntryName: document.getElementById("appointmentEntryName"),
    appointmentEntryNote: document.getElementById("appointmentEntryNote"),
    appointmentDateKey: document.getElementById("appointmentDateKey"),
    appointmentSubjectLabel: document.getElementById("appointmentSubjectLabel"),
    appointmentCustomerName: document.getElementById("appointmentCustomerName"),
    appointmentDayLabel: document.getElementById("appointmentDayLabel"),
    drawerTypeToggle: document.getElementById("drawerTypeToggle"),
    drawerTypeSessionBtn: document.getElementById("drawerTypeSessionBtn"),
    drawerTypeEventBtn: document.getElementById("drawerTypeEventBtn"),
    eventTitleField: document.getElementById("eventTitleField"),
    eventTitleInput: document.getElementById("eventTitleInput"),
    drawerSubjectControls: document.getElementById("drawerSubjectControls"),
    drawerSubjectPickerLabel: document.getElementById("drawerSubjectPickerLabel"),
    drawerSubjectPicker: document.getElementById("drawerSubjectPicker"),
    drawerNewCustomerField: document.getElementById("drawerNewCustomerField"),
    drawerNewCustomerName: document.getElementById("drawerNewCustomerName"),
    drawerTitle: document.getElementById("drawerTitle"),
    startTime: document.getElementById("startTime"),
    endTime: document.getElementById("endTime"),
    court: document.getElementById("court"),
    appointmentNote: document.getElementById("appointmentNote"),
    appointmentAmount: document.getElementById("appointmentAmount"),
    appointmentPaid: document.getElementById("appointmentPaid"),
    appointmentContactActions: document.getElementById("appointmentContactActions"),
    appointmentTextBtn: document.getElementById("appointmentTextBtn"),
    appointmentEmailBtn: document.getElementById("appointmentEmailBtn")
  };

  maybeSeedDemoData();

  let customers = readCustomers();
  let sports = readSports();
  let tasks = readTasks();
  let appointments = readAppointments();
  let visibleWeekStart = getStartOfWeek(new Date());
  let visibleMonthStart = getStartOfMonth(new Date());
  let monthSelectedDateKey = formatDateKey(new Date());
  let mobileDayOffset = getInitialMobileDayOffset(visibleWeekStart);
  let mobileViewMode = readMobileViewMode();
  let lastScheduleViewMode = mobileViewMode === MOBILE_VIEW_MODES.agenda ? MOBILE_VIEW_MODES.week : mobileViewMode;
  let activeDragSelection = null;
  let selectedCustomerId = readSelectedCustomerId();
  let selectedTaskId = "";
  let leftPanelMode = readLeftPanelMode();
  let weatherState = {
    city: readWeatherCity(),
    label: "",
    loading: false,
    error: "",
    dailyByDate: {}
  };
  let lockedScrollY = 0;
  let lastSwipeAt = 0;
  let nowIndicatorTimeoutId = null;
  let autoBackupEnabled = readAutoBackupEnabled();
  let autoBackupTimeoutId = null;
  let lastAutoBackupAt = 0;
  let lastAutoBackupSignature = "";
  let storageErrorShown = false;
  let drawerDraftByType = {
    customer: {
      subjectPickerValue: "",
      newCustomerName: "",
      entryId: "",
      entryName: "",
      entryNote: ""
    },
    task: {
      entryId: "",
      entryName: "",
      entryNote: ""
    }
  };

  init();

  function init() {
    populateTimeSelect(elements.startTime);
    populateTimeSelect(elements.endTime);
    populateSportIconSelect(elements.sportIconKey);
    if (elements.weatherCity) {
      elements.weatherCity.value = weatherState.city;
    }

    elements.prevWeekBtn?.addEventListener("click", handleDesktopPrevNav);
    elements.nextWeekBtn?.addEventListener("click", handleDesktopNextNav);
    elements.mobilePrevWeekBtn?.addEventListener("click", () => shiftWeek(-7));
    elements.mobileNextWeekBtn?.addEventListener("click", () => shiftWeek(7));
    elements.mobilePrevNavBtn?.addEventListener("click", handleMobilePrevNav);
    elements.mobileNextNavBtn?.addEventListener("click", handleMobileNextNav);
    elements.todayBtn?.addEventListener("click", () => {
      visibleWeekStart = getStartOfWeek(new Date());
      mobileDayOffset = getInitialMobileDayOffset(visibleWeekStart);
      render();
      refreshWeather();
    });
    elements.todayDayBtn?.addEventListener("click", jumpToToday);
    elements.desktopDayViewBtn?.addEventListener("click", () => setMobileViewMode(MOBILE_VIEW_MODES.day));
    elements.desktopWeekViewBtn?.addEventListener("click", () => setMobileViewMode(MOBILE_VIEW_MODES.week));
    elements.desktopMonthViewBtn?.addEventListener("click", handleDesktopMonthViewToggle);
    elements.mobilePrevDayBtn?.addEventListener("click", (event) => {
      flashMobileDayBarControl(event.currentTarget);
      handleMobilePrevNav();
    });
    elements.mobileNextDayBtn?.addEventListener("click", (event) => {
      flashMobileDayBarControl(event.currentTarget);
      handleMobileNextNav();
    });
    elements.mobileWeekViewBtn?.addEventListener("click", (event) => {
      flashMobileDayBarControl(event.currentTarget);
      if (mobileViewMode === MOBILE_VIEW_MODES.week) {
        setMobileViewMode(MOBILE_VIEW_MODES.day);
        return;
      }
      setMobileViewMode(MOBILE_VIEW_MODES.week);
    });
    elements.mobileMonthViewBtn?.addEventListener("click", (event) => {
      flashMobileDayBarControl(event.currentTarget);
      if (mobileViewMode === MOBILE_VIEW_MODES.month) {
        setMobileViewMode(MOBILE_VIEW_MODES.day);
        return;
      }
      setMobileViewMode(MOBILE_VIEW_MODES.month);
    });
    elements.manageBtn?.addEventListener("click", openManageDrawer);
    elements.sidebarBackupsBtn?.addEventListener("click", openMenuDrawer);
    elements.agendaBtn?.addEventListener("click", handleAgendaButtonClick);
    elements.mobileAgendaBtn?.addEventListener("click", handleAgendaButtonClick);
    elements.mobileViewSelect?.addEventListener("change", handleMobileViewSelectChange);
    elements.closeManageDrawerBtn?.addEventListener("click", closeManageDrawer);
    elements.menuBtn?.addEventListener("click", openMenuDrawer);
    elements.addBtn?.addEventListener("click", handleQuickAddClick);
    elements.closeMenuDrawerBtn?.addEventListener("click", closeMenuDrawer);
    elements.menuPrevWeekBtn?.addEventListener("click", () => {
      closeMenuDrawer();
      shiftWeek(-7);
    });
    elements.menuNextWeekBtn?.addEventListener("click", () => {
      closeMenuDrawer();
      shiftWeek(7);
    });
    elements.emailAgendaBtn?.addEventListener("click", handleEmailWeeklyAgenda);
    elements.emailFeaturesBtn?.addEventListener("click", handleEmailFeatureList);
    elements.exportBackupBtn?.addEventListener("click", handleExportBackup);
    elements.shareBackupBtn?.addEventListener("click", handleShareBackup);
    elements.importBackupInput?.addEventListener("change", handleImportBackup);
    elements.mergeBackupInput?.addEventListener("change", handleMergeBackup);
    elements.exportGoogleBtn?.addEventListener("click", handleExportGoogleCalendar);
    elements.exportMonthlyStatementBtn?.addEventListener("click", handleExportMonthlyStatementExcel);
    elements.exportYearlyStatementBtn?.addEventListener("click", handleExportYearlyStatementExcel);
    elements.monthPrevBtn?.addEventListener("click", () => shiftMonth(-1));
    elements.monthNextBtn?.addEventListener("click", () => shiftMonth(1));
    elements.desktopAddCustomerBtn?.addEventListener("click", handleDesktopCreateCustomerAppointmentClick);
    elements.desktopAddEventBtn?.addEventListener("click", handleDesktopAddEventClick);
    elements.desktopNewCustomerBtn?.addEventListener("click", handleDesktopAddNewCustomerClick);

    elements.showCustomersBtn?.addEventListener("click", () => setLeftPanelMode("customers"));
    elements.showTasksBtn?.addEventListener("click", () => setLeftPanelMode("tasks"));
    elements.customerForm?.addEventListener("submit", handleCustomerSubmit);
    elements.customerCancelBtn?.addEventListener("click", resetCustomerForm);
    elements.customerDeleteBtn?.addEventListener("click", handleDeleteCustomer);
    elements.sportForm?.addEventListener("submit", handleSportSubmit);
    elements.sportCancelBtn?.addEventListener("click", resetSportForm);
    elements.sportDeleteBtn?.addEventListener("click", handleDeleteSport);
    elements.customerPicker?.addEventListener("change", handleCustomerPickerChange);
    elements.taskForm?.addEventListener("submit", handleTaskSubmit);
    elements.taskCancelBtn?.addEventListener("click", () => {
      selectedTaskId = "";
      resetTaskForm();
      renderTasks();
      renderLeftPanel();
    });
    elements.taskDeleteBtn?.addEventListener("click", handleDeleteTask);
    elements.taskPicker?.addEventListener("change", handleTaskPickerChange);
    elements.taskName?.addEventListener("input", handleTaskDraftInput);
    elements.weatherForm?.addEventListener("submit", handleWeatherSubmit);
    elements.appointmentForm?.addEventListener("submit", handleAppointmentSubmit);
    elements.drawerSubjectPicker?.addEventListener("change", handleDrawerSubjectPickerChange);
    elements.drawerNewCustomerName?.addEventListener("input", handleDrawerNewCustomerNameInput);
    elements.startTime?.addEventListener("change", updateAppointmentContactActions);
    elements.endTime?.addEventListener("change", updateAppointmentContactActions);
    elements.court?.addEventListener("input", updateAppointmentContactActions);
    elements.closeDrawerBtn?.addEventListener("click", closeDrawer);
    elements.cancelAppointmentBtn?.addEventListener("click", closeDrawer);
    elements.deleteAppointmentBtn?.addEventListener("click", handleDeleteAppointment);
    elements.eventTitleInput?.addEventListener("input", handleEventTitleInput);
    elements.drawerTypeSessionBtn?.addEventListener("click", () => setDrawerEntryType("customer"));
    elements.drawerTypeEventBtn?.addEventListener("click", () => setDrawerEntryType("task"));
    elements.drawerOverlay?.addEventListener("click", handleOverlayClick);
    elements.calendarGrid?.addEventListener("click", handleCalendarClick);
    document.addEventListener("keydown", handleGlobalKeydown);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pageshow", handleSportsSync);
    window.addEventListener("storage", handleSportsStorageSync);
    window.addEventListener("pagehide", () => runAutoBackup({ force: true }));
    if (typeof mobileMediaQuery.addEventListener === "function") {
      mobileMediaQuery.addEventListener("change", handleMobileViewportChange);
    } else if (typeof mobileMediaQuery.addListener === "function") {
      mobileMediaQuery.addListener(handleMobileViewportChange);
    }

    attachMobileSwipeNavigation();

    render();
    refreshWeather();
    startNowIndicatorClock();
  }

  function render() {
    syncMobileLayoutState();
    elements.agendaBtn?.classList.toggle("is-active", mobileViewMode === MOBILE_VIEW_MODES.agenda);
    renderDesktopTopbarNav();
    renderWeekLabel();
    renderDesktopToolbarWeather();
    renderSports();
    renderCustomers();
    renderDesktopCustomerList();
    renderTasks();
    renderLeftPanel();
    renderWeatherStatus();
    renderMobileDayBar();
    renderCalendar();
    updateNowIndicator();
  }

  function renderWeekLabel() {
    const selectedDay = getSelectedMobileDay();

    if (mobileViewMode === MOBILE_VIEW_MODES.month) {
      if (elements.monthLabel) {
        elements.monthLabel.textContent = formatMonthYear(visibleMonthStart);
      }
      if (elements.weekLabel) {
        elements.weekLabel.textContent = formatMonthYear(visibleMonthStart);
      }
      if (elements.mobileWeekTitle) {
        elements.mobileWeekTitle.textContent = "";
      }
      return;
    }

    if (mobileViewMode === MOBILE_VIEW_MODES.day) {
      if (elements.weekLabel) {
        elements.weekLabel.textContent = selectedDay.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
      }
      if (elements.monthLabel) {
        elements.monthLabel.textContent = formatMonthYear(getStartOfMonth(selectedDay));
      }
      if (elements.mobileWeekTitle) {
        elements.mobileWeekTitle.textContent = "";
      }
      return;
    }

    const end = addDays(visibleWeekStart, 6);
    if (elements.monthLabel) {
      elements.monthLabel.textContent = formatVisibleMonthRange(visibleWeekStart, end);
    }
    if (elements.weekLabel) {
      const startYear = visibleWeekStart.getFullYear();
      const endYear = end.getFullYear();
      const sameYear = startYear === endYear;
      const sameMonth = sameYear && visibleWeekStart.getMonth() === end.getMonth();

      if (sameMonth) {
        const monthLabel = visibleWeekStart.toLocaleDateString(undefined, { month: "short" });
        elements.weekLabel.textContent = `${monthLabel} ${visibleWeekStart.getDate()} \u2013 ${end.getDate()}, ${startYear}`;
      } else if (sameYear) {
        elements.weekLabel.textContent = `${formatMonthDay(visibleWeekStart)} \u2013 ${formatMonthDay(end)}, ${startYear}`;
      } else {
        elements.weekLabel.textContent = `${formatMonthDay(visibleWeekStart)}, ${startYear} \u2013 ${formatMonthDay(end)}, ${endYear}`;
      }
    }
    if (elements.mobileWeekTitle) {
      if (isMobileLayout() && mobileViewMode === MOBILE_VIEW_MODES.week) {
        const startYear = visibleWeekStart.getFullYear();
        const endYear = end.getFullYear();
        const yearLabel = startYear === endYear ? `, ${startYear}` : `, ${startYear} - ${endYear}`;
        elements.mobileWeekTitle.textContent = `${formatMonthDay(visibleWeekStart)} \u2013 ${formatMonthDay(end)}${yearLabel}`;
      } else {
        elements.mobileWeekTitle.textContent = "";
      }
    }
  }

  function renderDesktopTopbarNav() {
    const isDayMode = mobileViewMode === MOBILE_VIEW_MODES.day;
    const isWeekMode = mobileViewMode === MOBILE_VIEW_MODES.week;
    const isMonthMode = mobileViewMode === MOBILE_VIEW_MODES.month;
    const isAgendaMode = mobileViewMode === MOBILE_VIEW_MODES.agenda;

    elements.desktopDayViewBtn?.classList.toggle("is-active", isDayMode);
    elements.desktopWeekViewBtn?.classList.toggle("is-active", isWeekMode);
    elements.desktopMonthViewBtn?.classList.toggle("is-active", isMonthMode);
    elements.agendaBtn?.classList.toggle("is-active", isAgendaMode);

    if (elements.desktopDayViewBtn) elements.desktopDayViewBtn.setAttribute("aria-selected", String(isDayMode));
    if (elements.desktopWeekViewBtn) elements.desktopWeekViewBtn.setAttribute("aria-selected", String(isWeekMode));
    if (elements.desktopMonthViewBtn) elements.desktopMonthViewBtn.setAttribute("aria-selected", String(isMonthMode));
    if (elements.agendaBtn) elements.agendaBtn.setAttribute("aria-selected", String(isAgendaMode));

    const prevLabel = isMonthMode ? "Previous Month" : (isDayMode ? "Previous Day" : "Previous Week");
    const nextLabel = isMonthMode ? "Next Month" : (isDayMode ? "Next Day" : "Next Week");

    if (elements.prevWeekBtn) {
      elements.prevWeekBtn.setAttribute("aria-label", prevLabel);
      elements.prevWeekBtn.title = prevLabel;
    }
    if (elements.nextWeekBtn) {
      elements.nextWeekBtn.setAttribute("aria-label", nextLabel);
      elements.nextWeekBtn.title = nextLabel;
    }
  }

  function renderDesktopToolbarWeather() {
    const cityLabel = formatCityRegionLabel(weatherState.city);
    if (elements.desktopCityLabel) {
      elements.desktopCityLabel.textContent = cityLabel || "Add weather";
    }
    if (elements.mobileWeekCityLabel) {
      elements.mobileWeekCityLabel.textContent = cityLabel || "Add weather";
    }

    const badgeNodes = [elements.desktopWeatherBadge, elements.mobileWeekWeatherBadge]
      .filter((node) => node instanceof HTMLElement);
    if (!badgeNodes.length) return;

    let badgeDay = getSelectedMobileDay();
    if (mobileViewMode !== MOBILE_VIEW_MODES.day) {
      const todayKey = formatDateKey(new Date());
      const startKey = formatDateKey(visibleWeekStart);
      const endKey = formatDateKey(addDays(visibleWeekStart, 6));
      badgeDay = todayKey >= startKey && todayKey <= endKey ? new Date() : visibleWeekStart;
    }

    const weather = weatherState.dailyByDate[formatDateKey(badgeDay)];
    if (!weather) {
      if (!cityLabel) {
        badgeNodes.forEach((node) => {
          node.hidden = true;
          node.innerHTML = "";
        });
        return;
      }

      const html = `${getWeatherIconMarkup("neutral")}<span>--</span>`;
      badgeNodes.forEach((node) => {
        node.hidden = false;
        node.innerHTML = html;
      });
      return;
    }

    const visual = getWeatherVisual(weather.weatherCode);
    const tempLabel = Number.isFinite(weather.maxTemp) ? `${Math.round(weather.maxTemp)}\u00B0` : "--";
    const html = `${visual.icon}<span>${escapeHtml(tempLabel)}</span>`;
    badgeNodes.forEach((node) => {
      node.hidden = false;
      node.innerHTML = html;
    });
  }

  function renderLeftPanel() {
    const isTasks = leftPanelMode === "tasks";

    if (elements.leftPanelEyebrow) {
      elements.leftPanelEyebrow.textContent = isTasks ? "Tasks & Things To Do" : "Customers";
    }

    if (elements.customerModeSection) elements.customerModeSection.hidden = isTasks;
    if (elements.taskModeSection) elements.taskModeSection.hidden = !isTasks;
    elements.showCustomersBtn?.classList.toggle("is-active", !isTasks);
    elements.showTasksBtn?.classList.toggle("is-active", isTasks);

    if (elements.customerCountChip) {
      elements.customerCountChip.textContent = String(isTasks ? tasks.length : customers.length);
    }
  }

  function renderSports() {
    if (elements.customerSportId) {
      const selectedSportId = elements.customerSportId.value;
      elements.customerSportId.innerHTML = [
        `<option value="">No sport selected</option>`,
        ...sports.map((sport) => `
          <option value="${escapeHtml(sport.id)}" ${sport.id === selectedSportId ? "selected" : ""}>
            ${escapeHtml(sport.name)}
          </option>
        `)
      ].join("");
    }

    if (elements.sportCountChip) {
      elements.sportCountChip.textContent = String(sports.length);
    }

    if (!elements.sportTable) return;

    if (!sports.length) {
      elements.sportTable.innerHTML = `<div class="appointment-empty">Add a sport here, then assign it to customers so the icon shows automatically on calendar events.</div>`;
      return;
    }

    elements.sportTable.innerHTML = sports.map((sport) => `
      <article class="sport-row" data-sport-id="${escapeHtml(sport.id)}">
        <span class="sport-icon-badge sport-row-icon" style="color:${escapeHtml(sport.color)};background:${escapeHtml(hexToRgba(sport.color, 0.12))};">
          ${renderSportIconSvg(sport.iconKey)}
        </span>
        <div class="sport-row-line">
          <strong>${escapeHtml(sport.name)}</strong>
        </div>
        <button
          class="customer-edit-button"
          type="button"
          data-sport-action="edit"
          data-sport-id="${escapeHtml(sport.id)}"
        >
          Edit
        </button>
      </article>
    `).join("");

    Array.from(elements.sportTable.querySelectorAll("[data-sport-action='edit']")).forEach((editNode) => {
      editNode.addEventListener("click", handleSportEditTrigger);
    });
  }

  function renderCustomers() {
    if (!elements.customerList || !elements.customerPicker) return;

    if (!customers.length) {
      selectedCustomerId = "";
      writeSelectedCustomerId(selectedCustomerId);
      elements.customerPicker.innerHTML = `<option value="">No customers yet</option>`;
      elements.customerList.innerHTML = `<div class="appointment-empty">Add a customer, then choose them from the dropdown.</div>`;
      return;
    }

    if (selectedCustomerId && !customers.some((customer) => customer.id === selectedCustomerId)) {
      selectedCustomerId = "";
      writeSelectedCustomerId(selectedCustomerId);
    }

    const sortedCustomers = customers
      .slice()
      .sort(compareCustomersBySurname);

    elements.customerPicker.innerHTML = [
      `<option value="" ${selectedCustomerId ? "" : "selected"}>+ New customer…</option>`,
      ...sortedCustomers.map((customer) => `
        <option value="${escapeHtml(customer.id)}" ${customer.id === selectedCustomerId ? "selected" : ""}>
          ${escapeHtml(formatNameSurnameFirst(customer.name) || customer.name)}${customer.isSample ? " (Sample)" : ""}
        </option>
      `)
    ].join("");

    if (!selectedCustomerId) {
      elements.customerList.innerHTML = `
        <article class="customer-card selected-customer-card">
          <div class="customer-card-top">
            <strong class="customer-name">New customer</strong>
          </div>
          <p class="customer-note">Close this drawer, then tap a time slot to add an event. Or choose a customer above, then tap a time slot to schedule a session.</p>
        </article>
      `;
      return;
    }

    const selectedCustomer = customers.find((customer) => customer.id === selectedCustomerId);
    if (!selectedCustomer) {
      selectedCustomerId = "";
      writeSelectedCustomerId(selectedCustomerId);
      renderCustomers();
      return;
    }

    const mobileLayout = isMobileLayout();
    const dragMarkup = mobileLayout ? "" : `
        <div
          class="customer-drag-handle"
          draggable="true"
          data-entry-type="customer"
          data-entry-id="${escapeHtml(selectedCustomer.id)}"
        >
          Drag To Schedule
        </div>
    `;
    const scheduleHint = mobileLayout
      ? "Close this drawer, then tap a time slot to schedule the selected customer."
      : "Drag this customer into a half-hour slot, or click any slot to schedule the selected customer.";
    const smsNumber = sanitizePhoneForSms(selectedCustomer.cell);
    const emailAddress = String(selectedCustomer.email || "").trim();
    const textButtonMarkup = smsNumber ? `
            <a class="customer-edit-button" href="sms:${escapeHtml(smsNumber)}">Text</a>
    ` : "";
    const emailButtonMarkup = emailAddress ? `
            <a class="customer-edit-button" href="mailto:${escapeHtml(emailAddress)}">Email</a>
    ` : "";

    const samplePillMarkup = selectedCustomer.isSample ? `<span class="sample-pill">Sample</span>` : "";
    const selectedCustomerDisplayName = formatNameSurnameFirst(selectedCustomer.name) || selectedCustomer.name;

    elements.customerList.innerHTML = `
      <article
        class="customer-card selected-customer-card"
        data-customer-id="${escapeHtml(selectedCustomer.id)}"
      >
        <div
          class="customer-card-top"
          data-customer-action="edit"
          data-customer-id="${escapeHtml(selectedCustomer.id)}"
        >
          <div class="customer-title-row">
            <strong class="customer-name">${escapeHtml(selectedCustomerDisplayName)}</strong>
            ${samplePillMarkup}
          </div>
          <div class="customer-card-actions">
            ${textButtonMarkup}
            ${emailButtonMarkup}
            <button
              class="customer-edit-button"
              type="button"
              data-customer-action="edit"
              data-customer-id="${escapeHtml(selectedCustomer.id)}"
            >
              Edit
            </button>
            <span class="customer-dot" style="background:${escapeHtml(getCustomerColor(selectedCustomer.id))}"></span>
          </div>
        </div>
        <p class="customer-note">${escapeHtml(selectedCustomer.note || "Ready to schedule")}</p>
        ${dragMarkup}
        <p class="selected-customer-hint">${escapeHtml(scheduleHint)}</p>
      </article>
    `;

    Array.from(elements.customerList.querySelectorAll("[data-customer-action='edit']")).forEach((editNode) => {
      editNode.addEventListener("mousedown", handleCustomerEditTrigger);
      editNode.addEventListener("click", handleCustomerEditTrigger);
    });

    Array.from(elements.customerList.querySelectorAll(".customer-drag-handle")).forEach((draggableNode) => {
      draggableNode.addEventListener("dragstart", handleEntryDragStart);
      draggableNode.addEventListener("dragend", handleEntryDragEnd);
    });
  }

  function renderDesktopCustomerList() {
    if (!elements.desktopCustomerPanel || !elements.desktopCustomerList) return;

    const shouldShow = !isMobileLayout();
    elements.desktopCustomerPanel.hidden = !shouldShow;
    if (!shouldShow) return;

    if (!customers.length) {
      elements.desktopCustomerList.innerHTML = `<div class="appointment-empty">No customers yet.</div>`;
      return;
    }

    const sortedCustomers = customers
      .slice()
      .sort(compareCustomersBySurname);

    elements.desktopCustomerList.innerHTML = sortedCustomers.map((customer) => {
      const displayName = formatNameSurnameFirst(customer.name || "") || customer.name || "Untitled";
      const ariaLabelName = displayName || customer.name || "customer";
      return `
        <a
          class="desktop-customer-item ${customer.id === selectedCustomerId ? "is-selected" : ""}"
          href="./customer-profile.html?id=${encodeURIComponent(customer.id)}"
          target="_blank"
          rel="noopener noreferrer"
          draggable="true"
          data-desktop-customer-action="select"
          data-entry-type="customer"
          data-entry-id="${escapeHtml(customer.id)}"
          data-entry-name="${escapeHtml(customer.name || "")}"
          data-entry-note="${escapeHtml(customer.note || "")}"
          aria-label="Open profile for ${escapeHtml(ariaLabelName)}"
        >
          <span class="desktop-customer-name">${escapeHtml(displayName)}</span>
          ${customer.isSample ? `<span class="sample-pill">Sample</span>` : ""}
        </a>
      `;
    }).join("");

    Array.from(elements.desktopCustomerList.querySelectorAll("[data-desktop-customer-action='select']")).forEach((node) => {
      node.addEventListener("click", handleDesktopCustomerSelect);
      node.addEventListener("dragstart", handleEntryDragStart);
      node.addEventListener("dragend", handleEntryDragEnd);
    });
  }

  function handleDesktopCustomerSelect(event) {
    const customerId = event.currentTarget?.getAttribute?.("data-entry-id") || "";
    if (!customerId) return;

    if (leftPanelMode !== "customers") {
      setLeftPanelMode("customers");
    }

    selectedCustomerId = customerId;
    writeSelectedCustomerId(selectedCustomerId);
    renderCustomers();
    renderDesktopCustomerList();
    renderMobileDayBar();
  }

  function getDefaultCreateDateKey() {
    if (mobileViewMode === MOBILE_VIEW_MODES.month && monthSelectedDateKey) return monthSelectedDateKey;

    const todayKey = formatDateKey(new Date());
    const visibleDays = getVisibleCalendarDays();
    const visibleToday = visibleDays.some((day) => formatDateKey(day) === todayKey);
    return visibleToday
      ? todayKey
      : formatDateKey(visibleDays[0] || new Date());
  }

  function getDefaultCreateStartMinutes(dateKey) {
    const todayKey = formatDateKey(new Date());
    if (dateKey !== todayKey) return 9 * 60;

    const nowMinutes = getMinutesSinceMidnight(new Date());
    return Math.ceil(nowMinutes / SLOT_MINUTES) * SLOT_MINUTES;
  }

  function handleDesktopCreateCustomerAppointmentClick() {
    const dateKey = getDefaultCreateDateKey();
    const startMinutes = getDefaultCreateStartMinutes(dateKey);
    const selectedCustomer = customers.find((customer) => customer.id === selectedCustomerId);

    openDrawer({
      mode: "create",
      entryType: "customer",
      entryId: selectedCustomer?.id || "",
      entryName: selectedCustomer?.name || "",
      entryNote: selectedCustomer?.note || "",
      dateKey,
      startMinutes: clampMinutes(startMinutes, SCHEDULE_START_MINUTES, SCHEDULE_END_MINUTES - SLOT_MINUTES)
    });

    window.setTimeout(() => {
      if (selectedCustomer?.id) {
        elements.startTime?.focus?.();
      } else {
        elements.drawerSubjectPicker?.focus?.();
      }
    }, 0);
  }

  function handleDesktopAddNewCustomerClick() {
    if (leftPanelMode !== "customers") {
      setLeftPanelMode("customers");
    }

    selectedCustomerId = "";
    writeSelectedCustomerId(selectedCustomerId);
    resetCustomerForm();
    renderCustomers();
    renderDesktopCustomerList();
    openManageDrawer();
    window.setTimeout(() => {
      elements.customerFirstName?.focus?.();
    }, 0);
  }

  function handleDesktopAddEventClick() {
    const dateKey = getDefaultCreateDateKey();
    const startMinutes = getDefaultCreateStartMinutes(dateKey);

    openDrawer({
      mode: "create",
      entryType: "task",
      entryId: "",
      entryName: "",
      entryNote: "",
      dateKey,
      startMinutes: clampMinutes(startMinutes, SCHEDULE_START_MINUTES, SCHEDULE_END_MINUTES - SLOT_MINUTES)
    });

    window.setTimeout(() => {
      elements.eventTitleInput?.focus?.();
    }, 0);
  }

  function handleQuickAddClick() {
    const dateKey = getDefaultCreateDateKey();
    const startMinutes = getDefaultCreateStartMinutes(dateKey);
    const selectedCustomer = customers.find((customer) => customer.id === selectedCustomerId);

    openDrawer({
      mode: "create",
      entryType: "customer",
      entryId: selectedCustomer?.id || "",
      entryName: selectedCustomer?.name || "",
      entryNote: selectedCustomer?.note || "",
      dateKey,
      startMinutes: clampMinutes(startMinutes, SCHEDULE_START_MINUTES, SCHEDULE_END_MINUTES - SLOT_MINUTES)
    });

    window.setTimeout(() => {
      if (selectedCustomer?.id) {
        elements.startTime?.focus?.();
      } else {
        elements.drawerSubjectPicker?.focus?.();
      }
    }, 0);
  }

  function renderCalendar() {
    if (!elements.calendarGrid) return;

    if (mobileViewMode === MOBILE_VIEW_MODES.agenda) {
      elements.calendarGrid.classList.remove("is-month-view");
      elements.calendarGrid.classList.remove("is-mobile-day-view");
      elements.calendarGrid.innerHTML = renderAgendaView();

      Array.from(elements.calendarGrid.querySelectorAll("[data-agenda-action='edit']")).forEach((node) => {
        node.addEventListener("click", handleAgendaEditClick);
      });
      return;
    }

    if (mobileViewMode === MOBILE_VIEW_MODES.month) {
      elements.calendarGrid.classList.remove("is-mobile-day-view");
      elements.calendarGrid.classList.add("is-month-view");
      elements.calendarGrid.innerHTML = renderMonthView();
      return;
    }

    elements.calendarGrid.classList.remove("is-month-view");

    const days = getVisibleCalendarDays();
    elements.calendarGrid.style.setProperty("--slot-count", String(SCHEDULE_SLOTS.length));
    elements.calendarGrid.style.setProperty("--slot-height", `${SLOT_HEIGHT}px`);
    elements.calendarGrid.style.setProperty("--day-count", String(days.length));
    elements.calendarGrid.classList.toggle("is-mobile-day-view", mobileViewMode === MOBILE_VIEW_MODES.day);

    const showMobileWeekRangeRow = isMobileLayout() && mobileViewMode === MOBILE_VIEW_MODES.week;
    elements.calendarGrid.innerHTML = `
      <div class="schedule-board">
        ${showMobileWeekRangeRow ? renderMobileWeekRangeRow() : ""}
        <div class="schedule-header">
          <div class="schedule-corner">Time</div>
          ${days.map(renderScheduleHeader).join("")}
        </div>
        <div class="schedule-body">
          <div class="time-rail">
            ${SCHEDULE_SLOTS.map(renderTimeLabel).join("")}
          </div>
          ${days.map(renderScheduleDay).join("")}
        </div>
      </div>
    `;

    Array.from(elements.calendarGrid.querySelectorAll(".time-slot")).forEach((slot) => {
      slot.addEventListener("dragover", handleTimeSlotDragOver);
      slot.addEventListener("dragleave", handleTimeSlotDragLeave);
      slot.addEventListener("drop", handleTimeSlotDrop);
    });
  }

  function renderMobileWeekRangeRow() {
    const weekEnd = addDays(visibleWeekStart, 6);
    const startYear = visibleWeekStart.getFullYear();
    const endYear = weekEnd.getFullYear();
    const sameYear = startYear === endYear;
    const sameMonth = sameYear && visibleWeekStart.getMonth() === weekEnd.getMonth();
    let label = "";
    if (sameMonth) {
      const monthLabel = visibleWeekStart.toLocaleDateString(undefined, { month: "short" });
      label = `${monthLabel} ${visibleWeekStart.getDate()} \u2013 ${weekEnd.getDate()}, ${startYear}`;
    } else if (sameYear) {
      label = `${formatMonthDay(visibleWeekStart)} \u2013 ${formatMonthDay(weekEnd)}, ${startYear}`;
    } else {
      label = `${formatMonthDay(visibleWeekStart)}, ${startYear} \u2013 ${formatMonthDay(weekEnd)}, ${endYear}`;
    }

    return `
      <div class="mobile-week-range-row">
        <div class="mobile-week-range-spacer" aria-hidden="true"></div>
        <div class="mobile-week-range-controls" aria-label="Week navigation">
          <button class="mobile-week-range-button" type="button" data-week-nav="prev" aria-label="Previous week">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M14.5 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </button>
          <div class="mobile-week-range-label" aria-live="polite">${escapeHtml(label)}</div>
          <button class="mobile-week-range-button" type="button" data-week-nav="next" aria-label="Next week">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M9.5 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </button>
        </div>
      </div>
    `;
  }

  function renderMonthView() {
    const monthStart = getStartOfMonth(visibleMonthStart);
    const monthIndex = monthStart.getMonth();
    const gridDays = getMonthGridDays(monthStart);
    const countsByDateKey = appointments.reduce((accumulator, entry) => {
      const key = entry?.dateKey;
      if (!key) return accumulator;
      accumulator[key] = (accumulator[key] || 0) + 1;
      return accumulator;
    }, {});

    const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return `
      <div class="month-view-nav" aria-label="Month navigation">
        <button class="home-nav-button month-view-nav-button" type="button" data-month-nav="prev" aria-label="Previous month">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M14.5 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </button>
        <div class="month-view-label" aria-live="polite">${escapeHtml(formatMonthYear(monthStart))}</div>
        <button class="home-nav-button month-view-nav-button" type="button" data-month-nav="next" aria-label="Next month">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M9.5 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </button>
      </div>
      <section class="month-board" aria-label="${escapeHtml(formatMonthYear(monthStart))}">
        <div class="month-grid" role="grid" aria-readonly="true">
          ${weekdayLabels.map((label) => `<div class="month-dow" role="columnheader">${escapeHtml(label)}</div>`).join("")}
          ${gridDays.map((day) => {
            const dateKey = formatDateKey(day);
            const count = countsByDateKey[dateKey] || 0;
            const isOutside = day.getMonth() !== monthIndex;
            const isSelected = dateKey === monthSelectedDateKey;
            const classes = [
              "month-cell",
              isOutside ? "is-outside" : "",
              isSelected ? "is-selected" : "",
              isToday(day) ? "is-today" : ""
            ].filter(Boolean).join(" ");
            const label = `${formatWeekday(day)}, ${formatMonthDay(day)}`;
            return `
              <button
                class="${escapeHtml(classes)}"
                type="button"
                data-month-action="select"
                data-date-key="${escapeHtml(dateKey)}"
                ${isSelected ? "aria-current=\"date\"" : ""}
                aria-label="Open ${escapeHtml(label)}"
              >
                <span class="month-cell-top">
                  <span class="month-day-number">${day.getDate()}</span>
                  ${count ? `<span class="month-day-count">${count}</span>` : ""}
                </span>
              </button>
            `;
          }).join("")}
        </div>
      </section>
    `;
  }

  function getMonthGridDays(monthStart) {
    const start = getStartOfWeek(monthStart);
    const monthEnd = getStartOfDay(new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0));
    const end = addDays(getStartOfWeek(monthEnd), 6);
    const dayCount = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
    return Array.from({ length: dayCount }, (_, index) => addDays(start, index));
  }

  function renderAgendaView() {
    const weekEnd = addDays(visibleWeekStart, 6);
    const startKey = formatDateKey(visibleWeekStart);
    const endKey = formatDateKey(weekEnd);

    const weekAppointments = appointments
      .filter((appointment) => appointment.dateKey >= startKey && appointment.dateKey <= endKey)
      .slice()
      .sort((a, b) => {
        const dateCompare = a.dateKey.localeCompare(b.dateKey);
        if (dateCompare !== 0) return dateCompare;
        return a.startMinutes - b.startMinutes;
      });

    if (!weekAppointments.length) {
      return `
        <div class="agenda-board">
          <h2 class="agenda-board-title">Agenda</h2>
          <div class="appointment-empty">No appointments scheduled for this week yet.</div>
        </div>
      `;
    }

    const groupedByDate = weekAppointments.reduce((acc, appointment) => {
      const key = appointment.dateKey;
      if (!acc[key]) acc[key] = [];
      acc[key].push(appointment);
      return acc;
    }, {});

    const dayKeys = Object.keys(groupedByDate).sort((a, b) => a.localeCompare(b));

    return `
      <div class="agenda-board">
        <h2 class="agenda-board-title">Agenda</h2>
        ${dayKeys.map((dateKey) => {
          const day = parseDateKey(dateKey);
          const headerLabel = day ? `${formatWeekday(day)}, ${formatMonthDay(day)}` : dateKey;
          const dayItems = groupedByDate[dateKey] || [];
          return `
            <section class="agenda-day">
              <header class="agenda-day-head">
                <strong>${escapeHtml(headerLabel)}</strong>
                <span class="agenda-day-count">${dayItems.length} item${dayItems.length === 1 ? "" : "s"}</span>
              </header>
              <div class="agenda-list">
                ${dayItems.map((appointment) => {
                  const meta = getAppointmentEntryMeta(appointment);
                   const title = appointment.entryType === "customer"
                     ? (formatNameSurnameFirst(meta.name) || meta.name)
                     : meta.name;
                   const court = String(appointment.court || "").trim();
                   const note = appointment.note || meta.note || "";
                   const detail = [court ? `Court: ${court}` : "", note].filter(Boolean).join(" \u00B7 ");
                   const timeLabel = `${formatMinutes(appointment.startMinutes)} - ${formatMinutes(appointment.endMinutes)}`;
                   const moneyBadge = renderAppointmentMoneyBadge(appointment);
                   return `
                     <article
                       class="agenda-item"
                       data-agenda-action="edit"
                       data-appointment-id="${escapeHtml(appointment.id)}"
                     >
                       <div class="agenda-time">${escapeHtml(timeLabel)}</div>
                       <div class="agenda-main">
                         <div class="agenda-title-row">
                           <span class="agenda-dot" style="background:${escapeHtml(meta.color)}"></span>
                           <strong class="agenda-title">${escapeHtml(title)}</strong>
                           ${moneyBadge}
                         </div>
                         ${detail ? `<div class="agenda-note">${escapeHtml(detail)}</div>` : ""}
                       </div>
                     </article>
                   `;
                }).join("")}
              </div>
            </section>
          `;
        }).join("")}
      </div>
    `;
  }

  function handleAgendaEditClick(event) {
    const appointmentId = event.currentTarget?.getAttribute?.("data-appointment-id");
    if (!appointmentId) return;
    const appointment = appointments.find((entry) => entry.id === appointmentId);
    if (!appointment) return;
    openDrawer({ mode: "edit", appointment });
  }

  const CANADIAN_REGION_ABBREVIATIONS = {
    alberta: "AB",
    "british columbia": "BC",
    manitoba: "MB",
    "new brunswick": "NB",
    "newfoundland and labrador": "NL",
    "northwest territories": "NT",
    "nova scotia": "NS",
    nunavut: "NU",
    ontario: "ON",
    "prince edward island": "PE",
    quebec: "QC",
    "québec": "QC",
    saskatchewan: "SK",
    yukon: "YT",
    "yukon territory": "YT"
  };

  const US_STATE_ABBREVIATIONS = {
    alabama: "AL",
    alaska: "AK",
    arizona: "AZ",
    arkansas: "AR",
    california: "CA",
    colorado: "CO",
    connecticut: "CT",
    delaware: "DE",
    florida: "FL",
    georgia: "GA",
    hawaii: "HI",
    idaho: "ID",
    illinois: "IL",
    indiana: "IN",
    iowa: "IA",
    kansas: "KS",
    kentucky: "KY",
    louisiana: "LA",
    maine: "ME",
    maryland: "MD",
    massachusetts: "MA",
    michigan: "MI",
    minnesota: "MN",
    mississippi: "MS",
    missouri: "MO",
    montana: "MT",
    nebraska: "NE",
    nevada: "NV",
    "new hampshire": "NH",
    "new jersey": "NJ",
    "new mexico": "NM",
    "new york": "NY",
    "north carolina": "NC",
    "north dakota": "ND",
    ohio: "OH",
    oklahoma: "OK",
    oregon: "OR",
    pennsylvania: "PA",
    "rhode island": "RI",
    "south carolina": "SC",
    "south dakota": "SD",
    tennessee: "TN",
    texas: "TX",
    utah: "UT",
    vermont: "VT",
    virginia: "VA",
    washington: "WA",
    "west virginia": "WV",
    wisconsin: "WI",
    wyoming: "WY",
    "district of columbia": "DC"
  };

  function formatCityRegionLabel(value) {
    const raw = (value || "").trim();
    if (!raw) return "";

    const parts = raw.split(",").map((part) => part.trim()).filter(Boolean);
    if (!parts.length) return "";
    if (parts.length === 1) return parts[0];

    const city = parts[0];
    const regionRaw = parts[1] || "";
    const regionClean = regionRaw.replace(/\./g, "").trim();
    if (!regionClean) return city;

    if (/^[A-Za-z]{2}$/.test(regionClean)) {
      return `${city}, ${regionClean.toUpperCase()}`;
    }

    const lookupKey = regionClean
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/\s+/g, " ")
      .trim();
    const canadianAbbr = CANADIAN_REGION_ABBREVIATIONS[lookupKey];
    if (canadianAbbr) return `${city}, ${canadianAbbr}`;

    const usAbbr = US_STATE_ABBREVIATIONS[lookupKey];
    if (usAbbr) return `${city}, ${usAbbr}`;

    return `${city}, ${regionClean}`;
  }

  let mobileDayBarFlashTimeoutId = null;

  function flashMobileDayBarControl(node) {
    const controls = [
      elements.mobilePrevDayBtn,
      elements.mobileNextDayBtn,
      elements.mobileWeekViewBtn,
      elements.mobileMonthViewBtn
    ].filter(Boolean);

    controls.forEach((control) => control.classList.remove("is-selected"));

    if (!(node instanceof HTMLElement)) return;

    node.classList.add("is-selected");

    if (mobileDayBarFlashTimeoutId) {
      window.clearTimeout(mobileDayBarFlashTimeoutId);
    }

    mobileDayBarFlashTimeoutId = window.setTimeout(() => {
      controls.forEach((control) => control.classList.remove("is-selected"));
    }, 240);
  }

  function renderMobileDayBar() {
    if (!elements.mobileDayLabel) return;

    const selectedDay = getSelectedMobileDay();
    const weekEnd = addDays(visibleWeekStart, 6);
    const isAgendaMode = mobileViewMode === MOBILE_VIEW_MODES.agenda;
    const isWeekMode = mobileViewMode === MOBILE_VIEW_MODES.week;
    const isMonthMode = mobileViewMode === MOBILE_VIEW_MODES.month;

    elements.agendaBtn?.classList.toggle("is-active", isAgendaMode);
    elements.mobileAgendaBtn?.classList.toggle("is-active", isAgendaMode);

    if (elements.mobileViewSelect) {
      elements.mobileViewSelect.value = isAgendaMode
        ? MOBILE_VIEW_MODES.agenda
        : (isMonthMode ? MOBILE_VIEW_MODES.month : (isWeekMode ? MOBILE_VIEW_MODES.week : "today"));
    }

    if (elements.mobileCityLabel) {
      const cityLabel = formatCityRegionLabel(weatherState.city);
      elements.mobileCityLabel.textContent = cityLabel;
      elements.mobileCityLabel.hidden = !cityLabel;
    }
    const prevLabel = isMonthMode ? "Previous Month" : ((isWeekMode || isAgendaMode) ? "Previous Week" : "Previous Day");
    const nextLabel = isMonthMode ? "Next Month" : ((isWeekMode || isAgendaMode) ? "Next Week" : "Next Day");
    if (elements.mobilePrevNavBtn) {
      elements.mobilePrevNavBtn.setAttribute("aria-label", prevLabel);
      elements.mobilePrevNavBtn.title = prevLabel;
    }
    if (elements.mobileNextNavBtn) {
      elements.mobileNextNavBtn.setAttribute("aria-label", nextLabel);
      elements.mobileNextNavBtn.title = nextLabel;
    }
    elements.mobileDayViewBtn?.classList.toggle("is-active", !isWeekMode && !isAgendaMode && !isMonthMode);
    elements.mobileWeekViewBtn?.classList.toggle("is-active", isWeekMode && !isAgendaMode);
    elements.mobileMonthViewBtn?.classList.toggle("is-active", isMonthMode && !isAgendaMode);
    if (elements.mobileDayViewBtn) elements.mobileDayViewBtn.setAttribute("aria-selected", String(!isWeekMode && !isAgendaMode && !isMonthMode));
    if (elements.mobileWeekViewBtn) elements.mobileWeekViewBtn.setAttribute("aria-selected", String(isWeekMode && !isAgendaMode));
    if (elements.mobileMonthViewBtn) elements.mobileMonthViewBtn.setAttribute("aria-selected", String(isMonthMode && !isAgendaMode));

    let rangeLabel = "";
    if (isMonthMode) {
      rangeLabel = formatMonthYear(visibleMonthStart);
    } else if (isWeekMode || isAgendaMode) {
      const startYear = visibleWeekStart.getFullYear();
      const endYear = weekEnd.getFullYear();
      const sameYear = startYear === endYear;
      const sameMonth = sameYear && visibleWeekStart.getMonth() === weekEnd.getMonth();
      if (sameMonth) {
        const monthLabel = visibleWeekStart.toLocaleDateString(undefined, { month: "short" });
        rangeLabel = `${monthLabel} ${visibleWeekStart.getDate()} \u2013 ${weekEnd.getDate()}, ${startYear}`;
      } else if (sameYear) {
        rangeLabel = `${formatMonthDay(visibleWeekStart)} \u2013 ${formatMonthDay(weekEnd)}, ${startYear}`;
      } else {
        rangeLabel = `${formatMonthDay(visibleWeekStart)}, ${startYear} \u2013 ${formatMonthDay(weekEnd)}, ${endYear}`;
      }
    } else {
      rangeLabel = selectedDay.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    }
    elements.mobileDayLabel.textContent = rangeLabel;
  }

  function renderScheduleHeader(day) {
    const weather = weatherState.dailyByDate[formatDateKey(day)];
    const isDayMode = mobileViewMode === MOBILE_VIEW_MODES.day;
    const isWeekMode = mobileViewMode === MOBILE_VIEW_MODES.week;
    const showCity = isMobileLayout() && isDayMode;
    const cityLabel = showCity ? formatCityRegionLabel(weatherState.city) : "";
    const dayMetaLabel = isDayMode ? formatMonthDay(day) : (isWeekMode ? String(day.getDate()) : formatMonthDay(day));
    return `
      <div class="schedule-day-head ${isToday(day) ? "is-today" : ""}">
        <div class="schedule-weather ${weather ? "has-weather" : ""}">
          ${cityLabel ? `<a class="weather-city" href="./weather-settings.html" aria-label="Update weather city">${escapeHtml(cityLabel)}</a>` : ""}
          <div class="weather-row">
            ${renderWeatherMarkup(weather)}
          </div>
        </div>
        <span class="day-name">${escapeHtml(formatWeekday(day))}</span>
        <strong class="day-meta">${escapeHtml(dayMetaLabel)}</strong>
      </div>
    `;
  }

  function renderWeatherMarkup(weather) {
    if (!weather) {
      return `<a class="weather-placeholder" href="./weather-settings.html" aria-label="Add weather (open weather settings)">Add weather</a>`;
    }

    const weatherVisual = getWeatherVisual(weather.weatherCode);
    const high = Number.isFinite(weather.maxTemp) ? `${Math.round(weather.maxTemp)}\u00B0` : "--";
    const low = Number.isFinite(weather.minTemp) ? `${Math.round(weather.minTemp)}\u00B0` : "--";
    return `
      <span class="weather-icon ${escapeHtml(weatherVisual.className)}" aria-hidden="true">${weatherVisual.icon}</span>
      <span class="weather-temp">${escapeHtml(high)}</span>
      <span class="weather-range">${escapeHtml(low)}</span>
    `;
  }

  function handleCustomerPickerChange(event) {
    selectedCustomerId = event.target.value;
    writeSelectedCustomerId(selectedCustomerId);
    renderCustomers();
    renderMobileDayBar();
  }

  function renderTasks() {
    if (!elements.taskPicker || !elements.taskList) return;
    const draftTaskName = valueOf(elements.taskName);

    if (!tasks.some((task) => task.id === selectedTaskId)) {
      selectedTaskId = "";
    }

    elements.taskPicker.innerHTML = [
      `<option value="" ${selectedTaskId ? "" : "selected"}>New Task</option>`,
      ...tasks.map((task) => `
        <option value="${escapeHtml(task.id)}" ${task.id === selectedTaskId ? "selected" : ""}>
          ${escapeHtml(task.name)}
        </option>
      `)
    ].join("");

    if (!selectedTaskId && draftTaskName) {
      elements.taskList.innerHTML = renderTaskCard({
        id: "",
        name: draftTaskName,
        note: "This is a one-off task. You can schedule it right away without saving it first."
      }, { isDraft: true });

      bindTaskCardEvents();
      return;
    }

    if (!tasks.length) {
      elements.taskList.innerHTML = `<div class="appointment-empty">No saved tasks yet. Type a task above to place a one-off task on the calendar, or save one to reuse it later.</div>`;
      return;
    }

    if (!selectedTaskId) {
      elements.taskList.innerHTML = `<div class="appointment-empty">New Task is ready. Type a task above to place it without saving, or choose a saved task from the dropdown.</div>`;
      return;
    }

    const selectedTask = tasks.find((task) => task.id === selectedTaskId);
    if (!selectedTask) {
      elements.taskList.innerHTML = `<div class="appointment-empty">Choose a saved task or start a new one.</div>`;
      return;
    }

    elements.taskList.innerHTML = renderTaskCard(selectedTask);
    bindTaskCardEvents();
  }

  function renderTaskCard(task, options = {}) {
    const isDraft = Boolean(options.isDraft);
    const taskId = task.id || "";
    const taskName = task.name || "Untitled Task";
    const taskNote = task.note || "";
    const mobileLayout = isMobileLayout();
    const taskActionMarkup = isDraft
      ? `<span class="task-state-pill">Draft</span>`
      : `
            <button
              class="customer-edit-button"
              type="button"
              data-task-action="edit"
              data-task-id="${escapeHtml(taskId)}"
            >
              Edit
            </button>
            <span class="task-state-pill">Saved</span>
        `;

    const dragMarkup = mobileLayout ? "" : `
        <div
          class="customer-drag-handle"
          draggable="true"
          data-entry-type="task"
          data-entry-id="${escapeHtml(taskId)}"
          data-entry-name="${escapeHtml(taskName)}"
          data-entry-note="${escapeHtml(taskNote)}"
        >
          Drag Task To Schedule
        </div>
    `;

    const hintText = (() => {
      if (mobileLayout) {
        return isDraft
          ? "This task is not saved. Tap any half-hour slot below to schedule it once."
          : "Tap any half-hour slot below to schedule this task.";
      }

      return isDraft
        ? "This task is not saved. Drag it into any half-hour slot or tap a slot to schedule it once."
        : "Choose New Task to start another one, or drop this task into any half-hour slot.";
    })();

    return `
      <article class="customer-card task-card ${isDraft ? "is-draft-task-card" : ""}" data-task-id="${escapeHtml(taskId)}">
        <div
          class="customer-card-top"
          ${isDraft ? "" : `data-task-action="edit" data-task-id="${escapeHtml(taskId)}"`}
        >
          <strong class="customer-name">${escapeHtml(taskName)}</strong>
          <div class="customer-card-actions">
            ${taskActionMarkup}
          </div>
        </div>
        <p class="customer-note">${escapeHtml(taskNote || "Tasks can be dropped into the calendar and they will show in light blue.")}</p>
        ${dragMarkup}
        <p class="selected-customer-hint">${escapeHtml(hintText)}</p>
      </article>
    `;
  }

  function bindTaskCardEvents() {
    Array.from(elements.taskList.querySelectorAll("[data-task-action='edit']")).forEach((editNode) => {
      editNode.addEventListener("mousedown", handleTaskEditTrigger);
      editNode.addEventListener("click", handleTaskEditTrigger);
    });

    Array.from(elements.taskList.querySelectorAll(".customer-drag-handle")).forEach((draggableNode) => {
      draggableNode.addEventListener("dragstart", handleEntryDragStart);
      draggableNode.addEventListener("dragend", handleEntryDragEnd);
    });
  }

  function handleTaskPickerChange(event) {
    selectedTaskId = event.target.value;
    if (!selectedTaskId) {
      resetTaskForm();
      renderTasks();
      renderMobileDayBar();
      return;
    }

    openTaskEditor(selectedTaskId);
    renderTasks();
  }

  function handleTaskDraftInput() {
    if (selectedTaskId) return;
    renderTasks();
    renderMobileDayBar();
  }

  function renderTimeLabel(slot, index) {
    const isHour = slot.minutes % 60 === 0;
    return `
      <div class="time-label ${isHour ? "is-hour" : ""}">
        <span>${escapeHtml(formatMinutes(slot.minutes))}</span>
      </div>
    `;
  }

  function renderScheduleDay(day) {
    const dateKey = formatDateKey(day);
    const dayAppointments = appointments
      .filter((appointment) => appointment.dateKey === dateKey)
      .sort((a, b) => a.startMinutes - b.startMinutes);

    return `
      <section class="schedule-day ${isToday(day) ? "is-today" : ""}" data-date-key="${escapeHtml(dateKey)}">
        <div class="schedule-slot-column">
          ${SCHEDULE_SLOTS.map((slot) => `
            <button
              class="time-slot ${slot.minutes % 60 === 0 ? "is-hour" : ""}"
              type="button"
              data-slot-action="open"
              data-date-key="${escapeHtml(dateKey)}"
              data-start-minutes="${slot.minutes}"
              aria-label="Schedule on ${escapeHtml(formatWeekday(day))} at ${escapeHtml(formatMinutes(slot.minutes))}"
            ></button>
          `).join("")}
        </div>
        <div class="appointment-layer">
          ${dayAppointments.map(renderTimedAppointment).join("")}
        </div>
        ${renderNowIndicator(day)}
      </section>
    `;
  }

  function renderNowIndicator(day) {
    if (!isToday(day)) return "";
    const nowMinutes = getMinutesSinceMidnight(new Date());
    const top = minutesToScheduleTop(nowMinutes);
    const shouldShow = Number.isFinite(top);
    return `
      <div class="now-indicator" data-now-indicator="true" ${shouldShow ? "" : "hidden"} style="top:${shouldShow ? top : 0}px" aria-hidden="true"></div>
    `;
  }

  function formatClockTime(date) {
    try {
      return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
    } catch {
      const hours24 = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const suffix = hours24 >= 12 ? "PM" : "AM";
      const hours12 = hours24 % 12 || 12;
      return `${hours12}:${minutes} ${suffix}`;
    }
  }

  function updateMobileCurrentTime() {
    if (!elements.mobileCurrentTime) return;

    if (!isMobileLayout() || mobileViewMode !== MOBILE_VIEW_MODES.day) {
      elements.mobileCurrentTime.hidden = true;
      return;
    }

    const selectedDay = getSelectedMobileDay();
    if (!isToday(selectedDay)) {
      elements.mobileCurrentTime.hidden = true;
      return;
    }

    elements.mobileCurrentTime.hidden = false;
    elements.mobileCurrentTime.textContent = formatClockTime(new Date());
  }

  function updateNowIndicator() {
    updateMobileCurrentTime();
    if (!elements.calendarGrid) return;
    const indicators = Array.from(elements.calendarGrid.querySelectorAll("[data-now-indicator='true']"));
    if (!indicators.length) return;

    const top = minutesToScheduleTop(getMinutesSinceMidnight(new Date()));
    const shouldShow = Number.isFinite(top);
    indicators.forEach((node) => {
      node.hidden = !shouldShow;
      if (shouldShow) node.style.top = `${top}px`;
    });
  }

  function startNowIndicatorClock() {
    if (nowIndicatorTimeoutId) {
      window.clearTimeout(nowIndicatorTimeoutId);
      nowIndicatorTimeoutId = null;
    }

    updateNowIndicator();

    const tick = () => {
      updateNowIndicator();
      nowIndicatorTimeoutId = window.setTimeout(tick, 60000 - (Date.now() % 60000));
    };

    nowIndicatorTimeoutId = window.setTimeout(tick, 60000 - (Date.now() % 60000));
  }

  function getMinutesSinceMidnight(date) {
    return (date.getHours() * 60) + date.getMinutes() + (date.getSeconds() / 60);
  }

  function minutesToScheduleTop(minutes) {
    if (!Number.isFinite(minutes)) return NaN;
    if (minutes < SCHEDULE_START_MINUTES) return NaN;
    if (minutes > SCHEDULE_END_MINUTES) return NaN;
    return ((minutes - SCHEDULE_START_MINUTES) / SLOT_MINUTES) * SLOT_HEIGHT;
  }

  function formatMoneyCompact(amountCents) {
    const cents = Number(amountCents);
    if (!Number.isFinite(cents) || cents <= 0) return "";
    const dollars = cents / 100;
    if (Number.isInteger(dollars)) return `$${dollars.toFixed(0)}`;
    return `$${dollars.toFixed(2)}`;
  }

  function renderAppointmentMoneyBadge(appointment) {
    const amountCents = Number(appointment?.amountCents ?? 0);
    if (!Number.isFinite(amountCents) || amountCents <= 0) return "";
    const label = formatMoneyCompact(amountCents);
    if (!label) return "";
    const isPaid = Boolean(appointment?.isPaid);
    const classes = ["money-badge", isPaid ? "is-paid" : ""].filter(Boolean).join(" ");
    return `<span class="${escapeHtml(classes)}">${isPaid ? "✓ " : ""}${escapeHtml(label)}</span>`;
  }

  function renderTimedAppointment(appointment) {
    const entryMeta = getAppointmentEntryMeta(appointment);
    const name = appointment.entryType === "customer"
      ? (formatNameSurnameFirst(entryMeta.name) || entryMeta.name)
      : entryMeta.name;
    const note = appointment.note || entryMeta.note;
    const court = String(appointment.court || "").trim();
    const detail = [court ? `Court: ${court}` : "", note].filter(Boolean).join(" \u00B7 ");
    const customerColor = entryMeta.color;
    const baseTop = ((appointment.startMinutes - SCHEDULE_START_MINUTES) / SLOT_MINUTES) * SLOT_HEIGHT;
    const baseHeight = ((appointment.endMinutes - appointment.startMinutes) / SLOT_MINUTES) * SLOT_HEIGHT;
    const verticalInset = 2;
    const top = baseTop + verticalInset;
    const height = Math.max(baseHeight - (verticalInset * 2), SLOT_HEIGHT - 6);
    return `
      <article
        class="timeline-appointment"
        data-appointment-id="${escapeHtml(appointment.id)}"
        style="top:${top}px;height:${height}px;border-color:${escapeHtml(customerColor)};background:${escapeHtml(hexToRgba(customerColor, 0.16))};"
      >
        <div class="appointment-title-row">
          ${entryMeta.iconMarkup ? `
            <span class="appointment-sport-icon" style="color:${escapeHtml(entryMeta.iconColor)};border-color:${escapeHtml(hexToRgba(entryMeta.iconColor, 0.22))};background:${escapeHtml(hexToRgba(entryMeta.iconColor, 0.12))};">
              ${entryMeta.iconMarkup}
            </span>
          ` : ""}
          <strong class="appointment-title">${escapeHtml(name)}</strong>
        </div>
        ${detail ? `<p class="appointment-note">${escapeHtml(detail)}</p>` : ""}
      </article>
    `;
  }

  function handleCustomerSubmit(event) {
    event.preventDefault();
    const editId = valueOf(elements.customerEditId);
    const firstName = valueOf(elements.customerFirstName);
    const surname = valueOf(elements.customerSurname);
    const sportId = valueOf(elements.customerSportId);
    const cell = valueOf(elements.customerCell);
    const email = valueOf(elements.customerEmail);
    const note = valueOf(elements.customerNote);
    if (!surname) {
      elements.customerSurname?.focus?.();
      return;
    }
    const name = firstName ? `${surname}, ${firstName}` : surname;

    if (editId) {
      customers = customers.map((customer) => customer.id === editId
        ? { ...customer, name, sportId, cell, email, note }
        : customer
      );
    } else {
      customers.unshift({
        id: createId("customer"),
        name,
        sportId,
        cell,
        email,
        note
      });
    }

    selectedCustomerId = editId || customers[0]?.id || "";
    writeSelectedCustomerId(selectedCustomerId);
    writeCustomers();
    resetCustomerForm();
    renderCustomers();
    renderLeftPanel();
    renderMobileDayBar();
    renderCalendar();
  }

  function handleCustomerEditTrigger(event) {
    if (event.target?.closest?.("a[href]")) return;
    event.preventDefault();
    event.stopPropagation();
    const customerId = event.currentTarget?.getAttribute?.("data-customer-id");
    if (!customerId) return;
    openCustomerEditor(customerId);
  }

  function openCustomerEditor(customerId) {
    const customer = customers.find((entry) => entry.id === customerId);
    if (!customer) return;

    selectedCustomerId = customer.id;
    writeSelectedCustomerId(selectedCustomerId);
    elements.customerForm?.classList.add("is-editing");
    elements.customerEditId.value = customer.id;
    const parsedName = splitNameForSurnameSort(customer.name);
    const sentinel = "\uffff";
    const customerSurname = parsedName?.surname && parsedName.surname !== sentinel ? parsedName.surname : "";
    const customerFirstName = parsedName?.given && parsedName.given !== sentinel ? parsedName.given : "";
    if (elements.customerFirstName) elements.customerFirstName.value = customerFirstName;
    if (elements.customerSurname) elements.customerSurname.value = customerSurname;
    if (elements.customerSportId) elements.customerSportId.value = customer.sportId || "";
    if (elements.customerCell) elements.customerCell.value = customer.cell || "";
    if (elements.customerEmail) elements.customerEmail.value = customer.email || "";
    if (elements.customerNote) elements.customerNote.value = customer.note || "";
    if (elements.customerPicker) elements.customerPicker.value = customer.id;
    if (elements.customerSubmitBtn) elements.customerSubmitBtn.textContent = "Save";
    if (elements.customerCancelBtn) elements.customerCancelBtn.hidden = false;
    if (elements.customerDeleteBtn) elements.customerDeleteBtn.hidden = false;
    elements.customerForm?.scrollIntoView?.({ block: "nearest", behavior: "smooth" });
    elements.customerFirstName?.focus?.();
    elements.customerFirstName?.select?.();
  }

  function resetCustomerForm() {
    elements.customerForm.reset();
    elements.customerForm?.classList.remove("is-editing");
    elements.customerEditId.value = "";
    if (elements.customerSportId) elements.customerSportId.value = "";
    if (elements.customerCell) elements.customerCell.value = "";
    if (elements.customerEmail) elements.customerEmail.value = "";
    if (elements.customerNote) elements.customerNote.value = "";
    if (elements.customerSubmitBtn) elements.customerSubmitBtn.textContent = "Add";
    if (elements.customerCancelBtn) elements.customerCancelBtn.hidden = true;
    if (elements.customerDeleteBtn) elements.customerDeleteBtn.hidden = true;
  }

  function handleDeleteCustomer() {
    const customerId = valueOf(elements.customerEditId);
    if (!customerId) return;

    const customer = customers.find((entry) => entry.id === customerId);
    if (!customer) return;

    const shouldDelete = window.confirm(`Delete ${customer.name} and remove their appointments from the calendar?`);
    if (!shouldDelete) return;

    customers = customers.filter((entry) => entry.id !== customerId);
    appointments = appointments.filter((entry) => !(entry.entryType === "customer" && entry.entryId === customerId));
    selectedCustomerId = "";
    writeSelectedCustomerId(selectedCustomerId);

    writeCustomers();
    writeAppointments();
    resetCustomerForm();
    renderCustomers();
    renderLeftPanel();
    renderMobileDayBar();
    renderCalendar();
  }

  function handleSportSubmit(event) {
    event.preventDefault();
    const editId = valueOf(elements.sportEditId);
    const name = valueOf(elements.sportName);
    const iconKey = valueOf(elements.sportIconKey) || SPORT_ICON_CHOICES[0].value;
    const color = elements.sportColor?.value || "#49dcb1";
    if (!name) return;

    if (editId) {
      sports = sports.map((sport) => sport.id === editId
        ? { ...sport, name, iconKey, color }
        : sport
      );
    } else {
      sports.unshift(normalizeSport({
        id: createId("sport"),
        name,
        iconKey,
        color
      }));
    }

    writeSports();
    resetSportForm();
    renderSports();
    renderCustomers();
    renderCalendar();
  }

  function handleSportEditTrigger(event) {
    const sportId = event.currentTarget?.getAttribute?.("data-sport-id");
    if (!sportId) return;
    openSportEditor(sportId);
  }

  function openSportEditor(sportId) {
    const sport = sports.find((entry) => entry.id === sportId);
    if (!sport) return;

    elements.sportForm?.classList.add("is-editing");
    elements.sportEditId.value = sport.id;
    elements.sportName.value = sport.name;
    if (elements.sportIconKey) elements.sportIconKey.value = sport.iconKey;
    if (elements.sportColor) elements.sportColor.value = sport.color;
    if (elements.sportSubmitBtn) elements.sportSubmitBtn.textContent = "Save Sport";
    if (elements.sportCancelBtn) elements.sportCancelBtn.hidden = false;
    if (elements.sportDeleteBtn) elements.sportDeleteBtn.hidden = false;
    elements.sportForm?.scrollIntoView?.({ block: "nearest", behavior: "smooth" });
    elements.sportName?.focus();
    elements.sportName?.select();
  }

  function resetSportForm() {
    elements.sportForm?.reset();
    elements.sportForm?.classList.remove("is-editing");
    if (elements.sportEditId) elements.sportEditId.value = "";
    if (elements.sportIconKey) elements.sportIconKey.value = SPORT_ICON_CHOICES[0].value;
    if (elements.sportColor) elements.sportColor.value = "#49dcb1";
    if (elements.sportSubmitBtn) elements.sportSubmitBtn.textContent = "Add Sport";
    if (elements.sportCancelBtn) elements.sportCancelBtn.hidden = true;
    if (elements.sportDeleteBtn) elements.sportDeleteBtn.hidden = true;
  }

  function handleDeleteSport() {
    const sportId = valueOf(elements.sportEditId);
    if (!sportId) return;

    const sport = sports.find((entry) => entry.id === sportId);
    if (!sport) return;

    const shouldDelete = window.confirm(`Delete ${sport.name} from the sports table? Customers using it will keep their names but lose the icon.`);
    if (!shouldDelete) return;

    sports = sports.filter((entry) => entry.id !== sportId);
    customers = customers.map((customer) => customer.sportId === sportId
      ? { ...customer, sportId: "" }
      : customer
    );

    writeSports();
    writeCustomers();
    resetSportForm();
    renderSports();
    renderCustomers();
    renderCalendar();
  }

  function handleTaskSubmit(event) {
    event.preventDefault();
    const editId = valueOf(elements.taskEditId);
    const name = valueOf(elements.taskName);
    if (!name) return;

    if (editId) {
      tasks = tasks.map((task) => task.id === editId
        ? { ...task, name }
        : task
      );
      selectedTaskId = editId;
    } else {
      const nextTask = normalizeTask({
        id: createId("task"),
        name
      });
      tasks.unshift(nextTask);
      selectedTaskId = nextTask.id;
    }

    writeTasks();
    resetTaskForm();
    renderTasks();
    renderLeftPanel();
    renderCalendar();
  }

  function handleTaskEditTrigger(event) {
    event.preventDefault();
    event.stopPropagation();
    const taskId = event.currentTarget?.getAttribute?.("data-task-id");
    if (!taskId) return;
    openTaskEditor(taskId);
  }

  function openTaskEditor(taskId) {
    const task = tasks.find((entry) => entry.id === taskId);
    if (!task) return;

    selectedTaskId = task.id;
    elements.taskForm?.classList.add("is-editing");
    elements.taskEditId.value = task.id;
    elements.taskName.value = task.name;
    if (elements.taskPicker) elements.taskPicker.value = task.id;
    if (elements.taskSubmitBtn) elements.taskSubmitBtn.textContent = "Save Task";
    if (elements.taskCancelBtn) elements.taskCancelBtn.hidden = false;
    if (elements.taskDeleteBtn) elements.taskDeleteBtn.hidden = false;
    elements.taskForm?.scrollIntoView?.({ block: "nearest", behavior: "smooth" });
    elements.taskName.focus();
    elements.taskName.select();
  }

  function resetTaskForm() {
    elements.taskForm?.reset();
    elements.taskForm?.classList.remove("is-editing");
    if (elements.taskEditId) elements.taskEditId.value = "";
    if (elements.taskSubmitBtn) elements.taskSubmitBtn.textContent = "Add Task";
    if (elements.taskCancelBtn) elements.taskCancelBtn.hidden = true;
    if (elements.taskDeleteBtn) elements.taskDeleteBtn.hidden = true;
    if (elements.taskPicker) elements.taskPicker.value = selectedTaskId;
    renderMobileDayBar();
  }

  function handleDeleteTask() {
    const taskId = valueOf(elements.taskEditId);
    if (!taskId) return;

    const task = tasks.find((entry) => entry.id === taskId);
    if (!task) return;

    const shouldDelete = window.confirm(`Delete ${task.name} from saved tasks?`);
    if (!shouldDelete) return;

    tasks = tasks.filter((entry) => entry.id !== taskId);
    appointments = appointments.filter((entry) => !(entry.entryType === "task" && entry.entryId === taskId));
    selectedTaskId = "";

    writeTasks();
    writeAppointments();
    resetTaskForm();
    renderTasks();
    renderLeftPanel();
    renderCalendar();
  }

  function handleWeatherSubmit(event) {
    event.preventDefault();
    const city = valueOf(elements.weatherCity);
    weatherState.city = city;
    writeWeatherCity(city);
    refreshWeather();
    renderWeatherStatus();
  }

  function handleEntryDragStart(event) {
    const source = event.currentTarget;
    const entryId = source?.getAttribute("data-entry-id");
    const entryType = source?.getAttribute("data-entry-type");
    const entryName = source?.getAttribute("data-entry-name") || "";
    const entryNote = source?.getAttribute("data-entry-note") || "";
    if (!entryType || !event.dataTransfer) return;

    activeDragSelection = { type: entryType, id: entryId || "", name: entryName, note: entryNote };
    event.dataTransfer.effectAllowed = "copy";
    event.dataTransfer.setData("text/plain", JSON.stringify(activeDragSelection));
    source.classList.add("is-dragging");
  }

  function handleEntryDragEnd(event) {
    event.currentTarget?.classList.remove("is-dragging");
    activeDragSelection = null;
    clearDropTargets();
  }

  function handleTimeSlotDragOver(event) {
    event.preventDefault();
    const slot = event.currentTarget;
    slot.classList.add("is-drop-target");
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "copy";
    }
  }

  function handleTimeSlotDragLeave(event) {
    event.currentTarget?.classList.remove("is-drop-target");
  }

  function handleTimeSlotDrop(event) {
    event.preventDefault();
    const slot = event.currentTarget;
    const dateKey = slot?.getAttribute("data-date-key");
    const startMinutes = Number.parseInt(slot?.getAttribute("data-start-minutes") || "", 10);
    clearDropTargets();

    const entrySelection = activeDragSelection
      || parseDraggedSelection(event.dataTransfer?.getData("text/plain"))
      || getActiveScheduleSelection();
    if ((!entrySelection?.id && !entrySelection?.name) || !dateKey || !Number.isFinite(startMinutes)) return;

    openDrawer({
      mode: "create",
      entryType: entrySelection.type,
      entryId: entrySelection.id,
      entryName: entrySelection.name,
      entryNote: entrySelection.note,
      dateKey,
      startMinutes
    });

    activeDragSelection = null;
  }

  function handleCalendarClick(event) {
    if (Date.now() - lastSwipeAt < 450) return;

    const weekNav = event.target instanceof Element
      ? event.target.closest("[data-week-nav]")
      : null;

    if (weekNav) {
      const direction = weekNav.getAttribute("data-week-nav");
      if (direction === "prev") shiftWeek(-7);
      if (direction === "next") shiftWeek(7);
      return;
    }

    const monthNav = event.target instanceof Element
      ? event.target.closest("[data-month-nav]")
      : null;

    if (monthNav) {
      const direction = monthNav.getAttribute("data-month-nav");
      if (direction === "prev") shiftMonth(-1);
      if (direction === "next") shiftMonth(1);
      return;
    }

    const monthCell = event.target instanceof Element
      ? event.target.closest("[data-month-action='select']")
      : null;

    if (monthCell) {
      const dateKey = monthCell.getAttribute("data-date-key") || "";
      const day = parseDateKey(dateKey);
      if (!day) return;

      monthSelectedDateKey = dateKey;
      visibleMonthStart = getStartOfMonth(day);
      visibleWeekStart = getStartOfWeek(day);
      mobileDayOffset = clampMobileDayOffset(
        Math.round((getStartOfDay(day).getTime() - visibleWeekStart.getTime()) / 86400000)
      );

      setMobileViewMode(MOBILE_VIEW_MODES.day);
      refreshWeather();
      return;
    }

    const slot = event.target instanceof Element
      ? event.target.closest("[data-slot-action='open']")
      : null;

    const activeSelection = getActiveScheduleSelection();
    if (slot) {
      const dateKey = slot.getAttribute("data-date-key");
      const startMinutes = Number.parseInt(slot.getAttribute("data-start-minutes") || "", 10);
      if (!dateKey || !Number.isFinite(startMinutes)) return;

      if (activeSelection?.id || activeSelection?.name) {
        openDrawer({
          mode: "create",
          entryType: activeSelection.type,
          entryId: activeSelection.id,
          entryName: activeSelection.name,
          entryNote: activeSelection.note,
          dateKey,
          startMinutes
        });
        return;
      }

      openDrawer({
        mode: "create",
        entryType: "task",
        entryId: "",
        entryName: "",
        entryNote: "",
        dateKey,
        startMinutes
      });
      window.setTimeout(() => {
        elements.eventTitleInput?.focus?.();
      }, 0);
      return;
    }

    const card = event.target instanceof Element
      ? event.target.closest("[data-appointment-id]")
      : null;

    if (!card) return;
    const appointmentId = card.getAttribute("data-appointment-id");
    const appointment = appointments.find((entry) => entry.id === appointmentId);
    if (!appointment) return;

    openDrawer({
      mode: "edit",
      appointment
    });
  }

  function setupDrawerSubjectControls({ entryType, entryId, entryName }) {
    if (!elements.drawerSubjectControls || !elements.drawerSubjectPicker || !elements.drawerNewCustomerField || !elements.drawerNewCustomerName) return;

    const isCustomer = entryType === "customer";
    elements.drawerSubjectControls.hidden = !isCustomer;
    if (!isCustomer) {
      elements.drawerNewCustomerField.hidden = true;
      elements.drawerNewCustomerName.value = "";
      return;
    }

    if (elements.drawerSubjectPickerLabel) {
      elements.drawerSubjectPickerLabel.textContent = "Customer";
    }

    const hasSelectedCustomer = !!entryId && customers.some((customer) => customer.id === entryId);
    const selectedValue = hasSelectedCustomer ? entryId : DRAWER_NEW_CUSTOMER_VALUE;
    const sortedCustomers = customers.slice().sort(compareCustomersBySurname);
    elements.drawerSubjectPicker.innerHTML = [
      `<option value="${DRAWER_NEW_CUSTOMER_VALUE}">+ New customer…</option>`,
      ...sortedCustomers.map((customer) => `<option value="${escapeHtml(customer.id)}">${escapeHtml(formatNameSurnameFirst(customer.name) || customer.name)}${customer.isSample ? " (Sample)" : ""}</option>`)
    ].join("");

    elements.drawerSubjectPicker.value = selectedValue;
    if (selectedValue === DRAWER_NEW_CUSTOMER_VALUE) {
      elements.drawerNewCustomerField.hidden = false;
      elements.drawerNewCustomerName.value = entryName || "";
    } else {
      elements.drawerNewCustomerField.hidden = true;
      elements.drawerNewCustomerName.value = "";
    }

    syncDrawerSubjectToFields();
  }

  function handleDrawerSubjectPickerChange() {
    syncDrawerSubjectToFields();
    updateAppointmentContactActions();
  }

  function handleDrawerNewCustomerNameInput() {
    syncDrawerSubjectToFields();
    updateAppointmentContactActions();
  }

  function handleEventTitleInput() {
    const entryType = valueOf(elements.appointmentEntryType) || "customer";
    if (entryType !== "task") return;
    if (!elements.eventTitleInput) return;

    const title = valueOf(elements.eventTitleInput);
    elements.appointmentEntryName.value = title;
    elements.appointmentCustomerName.textContent = title || "New event";
  }

  function resetDrawerDrafts() {
    drawerDraftByType = {
      customer: {
        subjectPickerValue: "",
        newCustomerName: "",
        entryId: "",
        entryName: "",
        entryNote: ""
      },
      task: {
        entryId: "",
        entryName: "",
        entryNote: ""
      }
    };
  }

  function stashDrawerDraft(entryType) {
    const normalizedType = entryType === "task" ? "task" : "customer";

    if (normalizedType === "customer") {
      drawerDraftByType.customer.subjectPickerValue = elements.drawerSubjectPicker?.value || DRAWER_NEW_CUSTOMER_VALUE;
      drawerDraftByType.customer.newCustomerName = valueOf(elements.drawerNewCustomerName);
      drawerDraftByType.customer.entryId = valueOf(elements.appointmentCustomerId);
      drawerDraftByType.customer.entryName = valueOf(elements.appointmentEntryName);
      drawerDraftByType.customer.entryNote = valueOf(elements.appointmentEntryNote);
      return;
    }

    drawerDraftByType.task.entryId = valueOf(elements.appointmentCustomerId);
    drawerDraftByType.task.entryName = valueOf(elements.appointmentEntryName);
    drawerDraftByType.task.entryNote = valueOf(elements.appointmentEntryNote);
  }

  function syncDrawerTypeToggle(entryType) {
    if (!elements.drawerTypeToggle || !elements.drawerTypeSessionBtn || !elements.drawerTypeEventBtn) return;

    const normalizedType = entryType === "task" ? "task" : "customer";
    const isCustomer = normalizedType === "customer";

    elements.drawerTypeSessionBtn.classList.toggle("is-active", isCustomer);
    elements.drawerTypeEventBtn.classList.toggle("is-active", !isCustomer);
    elements.drawerTypeSessionBtn.setAttribute("aria-pressed", String(isCustomer));
    elements.drawerTypeEventBtn.setAttribute("aria-pressed", String(!isCustomer));
  }

  function setDrawerEntryType(nextType) {
    if (!elements.appointmentDrawer?.classList.contains("is-open")) return;

    const appointmentId = valueOf(elements.appointmentId);
    if (appointmentId) return;

    const normalizedNext = nextType === "task" ? "task" : "customer";
    const currentType = valueOf(elements.appointmentEntryType) || "customer";
    const normalizedCurrent = currentType === "task" ? "task" : "customer";
    if (normalizedNext === normalizedCurrent) return;

    stashDrawerDraft(normalizedCurrent);

    elements.appointmentEntryType.value = normalizedNext;
    if (elements.appointmentSubjectLabel) {
      elements.appointmentSubjectLabel.textContent = normalizedNext === "task" ? "Event" : "Customer";
    }
    if (elements.drawerTitle) {
      elements.drawerTitle.textContent = normalizedNext === "task" ? "Schedule Event" : "Schedule Session";
    }

    if (normalizedNext === "customer") {
      const customerDraft = drawerDraftByType.customer;
      elements.appointmentCustomerId.value = customerDraft.entryId || "";
      elements.appointmentEntryName.value = customerDraft.entryName || "";
      elements.appointmentEntryNote.value = customerDraft.entryNote || "";

      setupDrawerSubjectControls({
        entryType: "customer",
        entryId: customerDraft.entryId || "",
        entryName: customerDraft.entryName || ""
      });

      if (elements.drawerSubjectPicker && customerDraft.subjectPickerValue) {
        const hasOption = Array.from(elements.drawerSubjectPicker.options).some((option) => option.value === customerDraft.subjectPickerValue);
        if (hasOption) {
          elements.drawerSubjectPicker.value = customerDraft.subjectPickerValue;
        }
      }
      if (elements.drawerNewCustomerName) {
        elements.drawerNewCustomerName.value = customerDraft.newCustomerName || "";
      }
      syncDrawerSubjectToFields();

      if (elements.eventTitleField) elements.eventTitleField.hidden = true;
      if (elements.eventTitleInput) elements.eventTitleInput.value = "";

      updateAppointmentContactActions();
      syncDrawerTypeToggle("customer");

      window.setTimeout(() => {
        elements.drawerSubjectPicker?.focus?.();
      }, 0);

      return;
    }

    const taskDraft = drawerDraftByType.task;
    elements.appointmentCustomerId.value = taskDraft.entryId || "";
    elements.appointmentEntryName.value = taskDraft.entryName || "";
    elements.appointmentEntryNote.value = taskDraft.entryNote || "";

    setupDrawerSubjectControls({ entryType: "task", entryId: "", entryName: "" });

    const shouldShowTitle = !taskDraft.entryId;
    if (elements.eventTitleField) elements.eventTitleField.hidden = !shouldShowTitle;
    if (elements.eventTitleInput) {
      elements.eventTitleInput.value = shouldShowTitle ? (taskDraft.entryName || "") : "";
    }

    const subject = getScheduleSubject("task", taskDraft.entryId || "", taskDraft.entryName || "", taskDraft.entryNote || "");
    const subjectName = subject?.name || "";
    elements.appointmentCustomerName.textContent = subjectName || taskDraft.entryName || "New event";

    updateAppointmentContactActions();
    syncDrawerTypeToggle("task");

    if (shouldShowTitle) {
      window.setTimeout(() => {
        elements.eventTitleInput?.focus?.();
      }, 0);
    }
  }

  function syncDrawerSubjectToFields() {
    const entryType = valueOf(elements.appointmentEntryType) || "customer";
    if (entryType !== "customer") return;
    if (!elements.drawerSubjectPicker || !elements.drawerNewCustomerField || !elements.drawerNewCustomerName) return;

    const selectedValue = elements.drawerSubjectPicker.value;
    const isNewCustomer = selectedValue === DRAWER_NEW_CUSTOMER_VALUE;
    elements.drawerNewCustomerField.hidden = !isNewCustomer;

    if (isNewCustomer) {
      const draftName = valueOf(elements.drawerNewCustomerName).trim();
      elements.appointmentCustomerId.value = "";
      elements.appointmentEntryName.value = draftName;
      elements.appointmentEntryNote.value = "";
      elements.appointmentCustomerName.textContent = draftName || "New customer";
      return;
    }

    const customer = customers.find((entry) => entry.id === selectedValue);
    elements.appointmentCustomerId.value = customer?.id || "";
    elements.appointmentEntryName.value = customer?.name || "";
    elements.appointmentEntryNote.value = customer?.note || "";
    const displayName = customer?.name ? (formatNameSurnameFirst(customer.name) || customer.name) : "";
    elements.appointmentCustomerName.textContent = displayName || "Select customer";
  }

  function isIOSDevice() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent || "");
  }

  function buildConfirmationMessage({ customerName, dateKey, startMinutes, endMinutes, court }) {
    const day = parseDateKey(dateKey);
    const dateLabel = day ? `${formatWeekday(day)}, ${formatMonthDay(day)}` : dateKey;
    const timeLabel = Number.isFinite(startMinutes) && Number.isFinite(endMinutes)
      ? `${formatMinutes(startMinutes)} - ${formatMinutes(endMinutes)}`
      : "";
    const courtLabel = String(court || "").trim();

    const parts = [
      `Hi ${customerName},`,
      `Confirming your lesson on ${dateLabel}${timeLabel ? ` at ${timeLabel}` : ""}.`
    ];

    if (courtLabel) parts.push(`Court: ${courtLabel}.`);
    parts.push("Reply if you need to reschedule.");

    return parts.join(" ");
  }

  function buildSmsHref(phoneNumber, body) {
    const number = sanitizePhoneForSms(phoneNumber);
    if (!number) return "sms:";
    const message = String(body || "").trim();
    if (!message) return `sms:${number}`;
    const separator = isIOSDevice() ? "&" : "?";
    return `sms:${number}${separator}body=${encodeURIComponent(message)}`;
  }

  function buildMailtoHref(email, subject, body) {
    const address = String(email || "").trim();
    if (!address) return "mailto:";
    const params = [];
    if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
    if (body) params.push(`body=${encodeURIComponent(body)}`);
    return `mailto:${address}${params.length ? `?${params.join("&")}` : ""}`;
  }

  function updateAppointmentContactActions() {
    if (!elements.appointmentContactActions || !elements.appointmentTextBtn || !elements.appointmentEmailBtn) return;

    const entryType = valueOf(elements.appointmentEntryType) || "customer";
    if (entryType !== "customer") {
      elements.appointmentContactActions.hidden = true;
      return;
    }

    const customerId = valueOf(elements.appointmentCustomerId);
    const customer = customerId ? customers.find((entry) => entry.id === customerId) : null;
    if (!customer) {
      elements.appointmentContactActions.hidden = true;
      return;
    }

    const dateKey = valueOf(elements.appointmentDateKey);
    const startMinutes = Number.parseInt(valueOf(elements.startTime), 10);
    const endMinutes = Number.parseInt(valueOf(elements.endTime), 10);
    const court = valueOf(elements.court);
    const message = buildConfirmationMessage({
      customerName: customer.name || "there",
      dateKey,
      startMinutes,
      endMinutes,
      court
    });

    const smsNumber = sanitizePhoneForSms(customer.cell);
    const emailAddress = String(customer.email || "").trim();
    const hasText = Boolean(smsNumber);
    const hasEmail = Boolean(emailAddress);

    if (hasText) {
      elements.appointmentTextBtn.hidden = false;
      elements.appointmentTextBtn.href = buildSmsHref(smsNumber, message);
    } else {
      elements.appointmentTextBtn.hidden = true;
      elements.appointmentTextBtn.href = "#";
    }

    if (hasEmail) {
      elements.appointmentEmailBtn.hidden = false;
      elements.appointmentEmailBtn.href = buildMailtoHref(
        emailAddress,
        "Lesson confirmation",
        message
      );
    } else {
      elements.appointmentEmailBtn.hidden = true;
      elements.appointmentEmailBtn.href = "#";
    }

    elements.appointmentContactActions.hidden = !(hasText || hasEmail);
  }

  function openDrawer(config) {
    closeManageDrawer({ silent: true });
    closeMenuDrawer({ silent: true });
    resetDrawerDrafts();

    const isEdit = config.mode === "edit";
    const appointment = config.appointment || null;
    const entryType = isEdit ? appointment.entryType : config.entryType;
    const entryId = isEdit ? appointment.entryId : config.entryId;
    const dateKey = isEdit ? appointment.dateKey : config.dateKey;
    const entryName = isEdit ? (appointment.entryName || "") : (config.entryName || "");
    const entryNote = isEdit ? (appointment.entryNote || "") : (config.entryNote || "");
    const day = parseDateKey(dateKey);
    const subject = getScheduleSubject(entryType, entryId, entryName, entryNote);
    const subjectName = subject?.name || "";
    const subjectNote = subject?.note || "";
    const subjectDisplayName = entryType === "customer"
      ? (formatNameSurnameFirst(subjectName) || subjectName)
      : subjectName;
    const defaultStartMinutes = clampMinutes(
      config.startMinutes ?? 9 * 60,
      SCHEDULE_START_MINUTES,
      SCHEDULE_END_MINUTES - SLOT_MINUTES
    );
    const defaultEndMinutes = Math.min(defaultStartMinutes + 60, SCHEDULE_END_MINUTES);

    if (!day) return;

    elements.appointmentId.value = appointment?.id || "";
    elements.appointmentEntryType.value = entryType;
    elements.appointmentCustomerId.value = entryId || "";
    elements.appointmentEntryName.value = subjectName;
    elements.appointmentEntryNote.value = subjectNote;
    elements.appointmentDateKey.value = dateKey;
    if (elements.appointmentSubjectLabel) {
      elements.appointmentSubjectLabel.textContent = entryType === "task" ? "Event" : "Customer";
    }
    elements.appointmentCustomerName.textContent = subjectDisplayName || (entryType === "customer" ? "Select customer" : "New event");
    elements.appointmentDayLabel.textContent = `${formatWeekday(day)}, ${formatMonthDay(day)}`;
    elements.drawerTitle.textContent = isEdit
      ? (entryType === "task" ? "Edit Event" : "Edit Session")
      : (entryType === "task" ? "Schedule Event" : "Schedule Session");
    if (elements.drawerTypeToggle) {
      elements.drawerTypeToggle.hidden = isEdit;
    }
    syncDrawerTypeToggle(entryType);

    if (elements.eventTitleField && elements.eventTitleInput) {
      const shouldShow = entryType === "task" && !entryId;
      elements.eventTitleField.hidden = !shouldShow;
      if (shouldShow) {
        elements.eventTitleInput.value = subjectName;
      } else {
        elements.eventTitleInput.value = "";
      }
    }
    if (elements.court) elements.court.value = appointment?.court || "";
    elements.appointmentNote.value = appointment?.note || subjectNote || "";
    if (elements.appointmentAmount) {
      elements.appointmentAmount.value = formatCentsForInput(appointment?.amountCents ?? 0);
    }
    if (elements.appointmentPaid) {
      elements.appointmentPaid.checked = Boolean(appointment?.isPaid);
    }
    elements.startTime.value = String(appointment?.startMinutes ?? defaultStartMinutes);
    elements.endTime.value = String(appointment?.endMinutes ?? defaultEndMinutes);
    elements.deleteAppointmentBtn.hidden = !isEdit;

    setupDrawerSubjectControls({
      entryType,
      entryId: entryId || "",
      entryName,
      subjectName,
      subjectNote
    });

    updateAppointmentContactActions();

    elements.drawerOverlay.hidden = false;
    elements.appointmentDrawer.classList.remove("is-stable");
    elements.appointmentDrawer.classList.add("is-open");
    elements.appointmentDrawer.setAttribute("aria-hidden", "false");
    stabilizeDrawerAfterSlide(elements.appointmentDrawer);

    if (isMobileLayout()) {
      lockBodyScroll();
    }
  }

  function closeDrawer() {
    elements.appointmentDrawer.classList.remove("is-stable");
    elements.appointmentDrawer.classList.remove("is-open");
    elements.appointmentDrawer.setAttribute("aria-hidden", "true");
    elements.appointmentForm.reset();
    elements.deleteAppointmentBtn.hidden = true;
    syncOverlayVisibility();
  }

  function stabilizeDrawerAfterSlide(drawer) {
    if (!drawer) return;

    const STABLE_TIMEOUT_MS = 260;
    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      drawer.removeEventListener("transitionend", handleTransitionEnd);
      if (drawer.classList.contains("is-open")) {
        drawer.classList.add("is-stable");
      }
    };

    const handleTransitionEnd = (event) => {
      if (event.target !== drawer) return;
      if (event.propertyName && event.propertyName !== "transform") return;
      finish();
    };

    drawer.addEventListener("transitionend", handleTransitionEnd);
    window.setTimeout(finish, STABLE_TIMEOUT_MS);
  }

  function openManageDrawer() {
    closeDrawer();
    closeMenuDrawer({ silent: true });

    if (!elements.manageDrawer) return;

    elements.drawerOverlay.hidden = false;
    elements.manageDrawer.classList.remove("is-stable");
    elements.manageDrawer.classList.add("is-open");
    elements.manageDrawer.setAttribute("aria-hidden", "false");
    stabilizeDrawerAfterSlide(elements.manageDrawer);

    if (isMobileLayout()) {
      lockBodyScroll();
    }
  }

  function closeManageDrawer(options = {}) {
    if (!elements.manageDrawer) return;
    elements.manageDrawer.classList.remove("is-stable");
    elements.manageDrawer.classList.remove("is-open");
    elements.manageDrawer.setAttribute("aria-hidden", "true");
    if (!options.silent) {
      syncOverlayVisibility();
    }
  }

  function openMenuDrawer() {
    closeDrawer();
    closeManageDrawer({ silent: true });

    if (!elements.menuDrawer) return;

    elements.drawerOverlay.hidden = false;
    elements.menuDrawer.classList.remove("is-stable");
    elements.menuDrawer.classList.add("is-open");
    elements.menuDrawer.setAttribute("aria-hidden", "false");
    stabilizeDrawerAfterSlide(elements.menuDrawer);

    if (isMobileLayout()) {
      lockBodyScroll();
    }
  }

  function closeMenuDrawer(options = {}) {
    if (!elements.menuDrawer) return;
    elements.menuDrawer.classList.remove("is-stable");
    elements.menuDrawer.classList.remove("is-open");
    elements.menuDrawer.setAttribute("aria-hidden", "true");
    if (!options.silent) {
      syncOverlayVisibility();
    }
  }

  function handleOverlayClick() {
    if (elements.appointmentDrawer?.classList.contains("is-open")) {
      closeDrawer();
      return;
    }
    if (elements.manageDrawer?.classList.contains("is-open")) {
      closeManageDrawer();
      return;
    }
    if (elements.menuDrawer?.classList.contains("is-open")) {
      closeMenuDrawer();
    }
  }

  function syncOverlayVisibility() {
    const appointmentOpen = elements.appointmentDrawer?.classList.contains("is-open");
    const manageOpen = elements.manageDrawer?.classList.contains("is-open");
    const menuOpen = elements.menuDrawer?.classList.contains("is-open");
    const shouldShow = appointmentOpen || manageOpen || menuOpen;

    if (elements.drawerOverlay) {
      elements.drawerOverlay.hidden = !shouldShow;
    }

    if (!shouldShow) {
      unlockBodyScroll();
    } else if (isMobileLayout()) {
      lockBodyScroll();
    }
  }

  function handleGlobalKeydown(event) {
    if (event.key !== "Escape") return;

    if (elements.appointmentDrawer?.classList.contains("is-open")) {
      closeDrawer();
      return;
    }
    if (elements.manageDrawer?.classList.contains("is-open")) {
      closeManageDrawer();
      return;
    }
    if (elements.menuDrawer?.classList.contains("is-open")) {
      closeMenuDrawer();
    }
  }

  function handleAppointmentSubmit(event) {
    event.preventDefault();

    syncDrawerSubjectToFields();

    const appointmentId = valueOf(elements.appointmentId);
    const entryType = valueOf(elements.appointmentEntryType) || "customer";
    let entryId = valueOf(elements.appointmentCustomerId);
    const entryName = valueOf(elements.appointmentEntryName);
    const entryNote = valueOf(elements.appointmentEntryNote);
    const dateKey = valueOf(elements.appointmentDateKey);
    const startMinutes = Number.parseInt(valueOf(elements.startTime), 10);
    const endMinutes = Number.parseInt(valueOf(elements.endTime), 10);
    const court = valueOf(elements.court);
    const note = valueOf(elements.appointmentNote);
    const amountCents = parseAmountToCents(valueOf(elements.appointmentAmount));
    const isPaid = Boolean(elements.appointmentPaid?.checked);
    const draftTaskName = entryType === "task" && !entryId
      ? entryName
      : "";

    if (!dateKey || !Number.isFinite(startMinutes) || !Number.isFinite(endMinutes)) return;
    if (endMinutes <= startMinutes) {
      window.alert("End time needs to be later than the start time.");
      return;
    }

    if (entryType === "customer" && !entryId) {
      const newCustomerName = valueOf(elements.drawerNewCustomerName).trim() || entryName.trim();
      if (!newCustomerName) {
        window.alert("Add a customer name first.");
        return;
      }

      const existingCustomer = customers.find((customer) => customer.name.trim().toLowerCase() === newCustomerName.toLowerCase());
      if (existingCustomer) {
        entryId = existingCustomer.id;
        selectedCustomerId = entryId;
        writeSelectedCustomerId(selectedCustomerId);
      } else {
        const nextCustomer = normalizeCustomer({
          id: createId("customer"),
          name: newCustomerName
        });
        customers.unshift(nextCustomer);
        entryId = nextCustomer.id;
        selectedCustomerId = entryId;
        writeSelectedCustomerId(selectedCustomerId);
        writeCustomers();
        renderCustomers();
        renderLeftPanel();
        renderMobileDayBar();
      }

      elements.appointmentCustomerId.value = entryId;
    }

    if (!entryId && !draftTaskName) {
      window.alert(entryType === "task"
        ? "Add an event title first."
        : "Select or add a customer first.");
      return;
    }

    const overlaps = appointments
      .filter((entry) => entry.dateKey === dateKey && entry.id !== appointmentId)
      .filter((entry) => startMinutes < entry.endMinutes && endMinutes > entry.startMinutes)
      .sort((a, b) => a.startMinutes - b.startMinutes);

    if (overlaps.length) {
      const lines = overlaps.slice(0, 4).map((entry) => {
        const meta = getAppointmentEntryMeta(entry);
        const label = entry.entryType === "customer"
          ? (formatNameSurnameFirst(meta.name) || meta.name)
          : meta.name;
        return `${formatMinutes(entry.startMinutes)}-${formatMinutes(entry.endMinutes)} ${label}`;
      });
      const moreCount = overlaps.length - lines.length;
      if (moreCount > 0) lines.push(`+ ${moreCount} more...`);

      const message = [
        "Double-book warning: this overlaps another appointment.",
        "",
        ...lines,
        "",
        "Save anyway?"
      ].join("\n");

      const shouldContinue = window.confirm(message);
      if (!shouldContinue) return;
    }

    const nextAppointment = {
      id: appointmentId || createId("appointment"),
      entryType,
      entryId,
      entryName: entryType === "task" && !entryId ? draftTaskName : "",
      entryNote: entryType === "task" && !entryId ? entryNote : "",
      dateKey,
      startMinutes,
      endMinutes,
      court,
      note,
      amountCents,
      isPaid
    };

    if (appointmentId) {
      appointments = appointments.map((entry) => entry.id === appointmentId ? nextAppointment : entry);
    } else {
      appointments.push(nextAppointment);
    }

    writeAppointments();
    closeDrawer();
    renderCalendar();
  }

  function handleDeleteAppointment() {
    const appointmentId = valueOf(elements.appointmentId);
    if (!appointmentId) return;

    appointments = appointments.filter((entry) => entry.id !== appointmentId);
    writeAppointments();
    closeDrawer();
    renderCalendar();
  }

  function buildBackupPayload() {
    return {
      version: 2,
      exportedAt: new Date().toISOString(),
      visibleWeekStart: formatDateKey(visibleWeekStart),
      leftPanelMode,
      weatherCity: weatherState.city || "",
      userEmail: readUserEmail(),
      customers,
      sports,
      tasks,
      appointments
    };
  }

  function buildBackupSignature(payload) {
    try {
      const signaturePayload = { ...payload, exportedAt: "" };
      return JSON.stringify(signaturePayload);
    } catch {
      return "";
    }
  }

  function scheduleAutoBackup() {
    if (!autoBackupEnabled) return;

    if (autoBackupTimeoutId) {
      window.clearTimeout(autoBackupTimeoutId);
      autoBackupTimeoutId = null;
    }

    autoBackupTimeoutId = window.setTimeout(() => {
      autoBackupTimeoutId = null;
      runAutoBackup();
    }, AUTO_BACKUP_DEBOUNCE_MS);
  }

  function runAutoBackup(options = {}) {
    if (!autoBackupEnabled) return;

    const force = Boolean(options.force);
    const now = Date.now();
    if (!force && now - lastAutoBackupAt < AUTO_BACKUP_MIN_INTERVAL_MS) return;

    const payload = buildBackupPayload();
    const signature = buildBackupSignature(payload);
    if (!force && signature && signature === lastAutoBackupSignature) return;

    lastAutoBackupAt = now;
    lastAutoBackupSignature = signature || lastAutoBackupSignature;

    const backups = readAutoBackups();
    backups.unshift({
      id: createId("autosave"),
      createdAt: payload.exportedAt,
      payload
    });

    writeAutoBackups(backups.slice(0, AUTO_BACKUP_MAX));
  }

  function handleExportBackup() {
    const payload = buildBackupPayload();

    const filename = `calappt-backup-${formatDateKey(new Date())}.json`;
    downloadTextFile(filename, `${JSON.stringify(payload, null, 2)}\n`, "application/json;charset=utf-8");
  }

  async function handleShareBackup() {
    const payload = buildBackupPayload();
    const filename = `calappt-backup-${formatDateKey(new Date())}.json`;
    const contents = `${JSON.stringify(payload, null, 2)}\n`;

    if (typeof navigator?.share === "function") {
      try {
        const file = new File([contents], filename, { type: "application/json" });
        const shareData = { files: [file] };

        if (typeof navigator.canShare !== "function" || navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return;
        }
      } catch {}
    }

    downloadTextFile(filename, contents, "application/json;charset=utf-8");
    window.alert("Backup downloaded. To AirDrop it: open the file in Downloads (Files app on iPhone, Downloads folder on Mac) and share via AirDrop.");
  }

  async function handleImportBackup(event) {
    const file = event.target?.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      const nextCustomers = Array.isArray(parsed.customers)
        ? parsed.customers.map(normalizeCustomer)
        : [];
      const nextSports = Array.isArray(parsed.sports)
        ? parsed.sports.map(normalizeSport)
        : [];
      const nextTasks = Array.isArray(parsed.tasks)
        ? parsed.tasks.map(normalizeTask)
        : [];
      const nextAppointments = Array.isArray(parsed.appointments)
        ? parsed.appointments.map(normalizeAppointment).filter(Boolean)
        : [];

      customers = nextCustomers.length ? nextCustomers : [];
      sports = nextSports.length ? nextSports : DEFAULT_SPORTS.slice();
      tasks = nextTasks;
      appointments = nextAppointments;
      leftPanelMode = parsed.leftPanelMode === "tasks" ? "tasks" : "customers";
      weatherState.city = typeof parsed.weatherCity === "string" ? parsed.weatherCity : "";
      writeUserEmail(typeof parsed.userEmail === "string" ? parsed.userEmail : "");
      visibleWeekStart = parseDateKey(parsed.visibleWeekStart) || getStartOfWeek(new Date());
      mobileDayOffset = getInitialMobileDayOffset(visibleWeekStart);
      selectedCustomerId = "";
      writeSelectedCustomerId(selectedCustomerId);
      selectedTaskId = "";

      writeCustomers();
      writeSports();
      writeTasks();
      writeAppointments();
      writeLeftPanelMode(leftPanelMode);
      writeWeatherCity(weatherState.city);

      if (elements.weatherCity) {
        elements.weatherCity.value = weatherState.city;
      }
      if (elements.importBackupInput) {
        elements.importBackupInput.value = "";
      }

      resetCustomerForm();
      resetSportForm();
      resetTaskForm();
      render();
      refreshWeather();
    } catch {
      window.alert("That backup file could not be imported.");
      if (elements.importBackupInput) {
        elements.importBackupInput.value = "";
      }
    }
  }

  async function handleMergeBackup(event) {
    const file = event.target?.files?.[0];
    if (!file) return;

    const beforeCounts = {
      customers: customers.length,
      sports: sports.length,
      tasks: tasks.length,
      appointments: appointments.length
    };

    const resetInput = () => {
      if (elements.mergeBackupInput) {
        elements.mergeBackupInput.value = "";
      }
    };

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      const incomingCustomers = Array.isArray(parsed.customers)
        ? parsed.customers.map(normalizeCustomer)
        : [];
      const incomingSports = Array.isArray(parsed.sports)
        ? parsed.sports.map(normalizeSport)
        : [];
      const incomingTasks = Array.isArray(parsed.tasks)
        ? parsed.tasks.map(normalizeTask)
        : [];
      const incomingAppointments = Array.isArray(parsed.appointments)
        ? parsed.appointments.map(normalizeAppointment).filter(Boolean)
        : [];

      const mergeById = (existing, incoming) => {
        const map = new Map();
        (Array.isArray(existing) ? existing : []).forEach((item) => {
          if (item?.id) map.set(item.id, item);
        });
        (Array.isArray(incoming) ? incoming : []).forEach((item) => {
          if (item?.id) map.set(item.id, item);
        });
        return Array.from(map.values());
      };

      customers = mergeById(customers, incomingCustomers);
      sports = mergeById((sports.length ? sports : DEFAULT_SPORTS.slice()), incomingSports);
      if (!sports.length) sports = DEFAULT_SPORTS.slice();
      tasks = mergeById(tasks, incomingTasks);
      appointments = mergeById(appointments, incomingAppointments);

      selectedCustomerId = "";
      writeSelectedCustomerId(selectedCustomerId);
      selectedTaskId = "";

      writeCustomers();
      writeSports();
      writeTasks();
      writeAppointments();

      resetCustomerForm();
      resetSportForm();
      resetTaskForm();
      render();
      refreshWeather();

      const afterCounts = {
        customers: customers.length,
        sports: sports.length,
        tasks: tasks.length,
        appointments: appointments.length
      };

      const diff = (key) => afterCounts[key] - beforeCounts[key];
      window.alert([
        "Merge complete.",
        `Customers: ${beforeCounts.customers} → ${afterCounts.customers} (${diff("customers") >= 0 ? "+" : ""}${diff("customers")})`,
        `Appointments: ${beforeCounts.appointments} → ${afterCounts.appointments} (${diff("appointments") >= 0 ? "+" : ""}${diff("appointments")})`,
        "",
        "If the same item exists on both devices, the imported backup wins."
      ].join("\n"));
    } catch {
      window.alert("That backup file could not be merged.");
    } finally {
      resetInput();
    }
  }

  function handleExportGoogleCalendar() {
    const weekEnd = addDays(visibleWeekStart, 6);
    const weekStartKey = formatDateKey(visibleWeekStart);
    const weekEndKey = formatDateKey(weekEnd);
    const weekAppointments = appointments
      .filter((entry) => entry.dateKey >= weekStartKey && entry.dateKey <= weekEndKey)
      .sort((left, right) => {
        const dateCompare = left.dateKey.localeCompare(right.dateKey);
        if (dateCompare !== 0) return dateCompare;
        return left.startMinutes - right.startMinutes;
      });

    if (!weekAppointments.length) {
      window.alert("There are no calendar entries in the visible week to export.");
      return;
    }

    const nowStamp = formatICSDateTime(new Date());
    const icsLines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//CalAppt//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      `X-WR-CALNAME:${escapeICSText(`CalAppt ${formatVisibleMonthRange(visibleWeekStart, weekEnd)}`)}`
    ];

    weekAppointments.forEach((appointment) => {
      const subject = getScheduleSubject(appointment.entryType, appointment.entryId, appointment.entryName, appointment.entryNote);
      if (!subject) return;

      const startDate = buildDateFromMinutes(appointment.dateKey, appointment.startMinutes);
      const endDate = buildDateFromMinutes(appointment.dateKey, appointment.endMinutes);
      const court = String(appointment.court || "").trim();
      const summary = appointment.entryType === "task"
        ? `Task: ${subject.name}`
        : `Session: ${subject.name}`;
      const descriptionParts = [];
      if (court) descriptionParts.push(`Court: ${court}`);
      if (appointment.note) descriptionParts.push(appointment.note);
      if (!appointment.note && subject.note) descriptionParts.push(subject.note);
      descriptionParts.push(`Week view export from CalAppt`);

      icsLines.push(
        "BEGIN:VEVENT",
        `UID:${escapeICSText(appointment.id)}@coach-appointment-calendar`,
        `DTSTAMP:${nowStamp}`,
        `DTSTART:${formatICSDateTime(startDate)}`,
        `DTEND:${formatICSDateTime(endDate)}`,
        `SUMMARY:${escapeICSText(summary)}`,
        ...(court ? [`LOCATION:${escapeICSText(court)}`] : []),
        `DESCRIPTION:${escapeICSText(descriptionParts.join("\n"))}`,
        "END:VEVENT"
      );
    });

    icsLines.push("END:VCALENDAR");

    const filename = `calappt-${formatDateKey(visibleWeekStart)}.ics`;
    downloadTextFile(filename, `${icsLines.join("\r\n")}\r\n`, "text/calendar;charset=utf-8");
  }

  function formatMoneyStatement(amountCents) {
    const cents = normalizeAmountCents(amountCents);
    return `$${(cents / 100).toFixed(2)}`;
  }

  function toCsvField(value) {
    const str = String(value ?? "");
    if (/["\n\r,]/.test(str)) {
      return `"${str.replaceAll('"', '""')}"`;
    }
    return str;
  }

  function toCsvLine(fields) {
    return (Array.isArray(fields) ? fields : []).map(toCsvField).join(",");
  }

  function downloadCsvFile(filename, lines) {
    const rows = Array.isArray(lines) ? lines : [];
    const contents = `\ufeff${rows.join("\r\n")}\r\n`;
    downloadTextFile(filename, contents, "text/csv;charset=utf-8");
  }

  function parseYearMonth(value) {
    const raw = String(value || "").trim();
    const match = raw.match(/^(\d{4})-(\d{2})$/);
    if (!match) return null;
    const year = Number(match[1]);
    const month = Number(match[2]);
    if (!Number.isFinite(year) || !Number.isFinite(month)) return null;
    if (month < 1 || month > 12) return null;
    const date = new Date(year, month - 1, 1);
    return Number.isFinite(date.getTime()) ? getStartOfMonth(date) : null;
  }

  function getStatementMonthStart() {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEYS.statementMonth);
      return parseYearMonth(saved) ?? getStartOfMonth(new Date());
    } catch {
      return getStartOfMonth(new Date());
    }
  }

  function getStatementYear() {
    try {
      const saved = Number(window.localStorage.getItem(STORAGE_KEYS.statementYear));
      if (Number.isFinite(saved) && saved >= 1970 && saved <= 2100) return Math.round(saved);
    } catch {}
    return new Date().getFullYear();
  }

  function handleExportMonthlyStatementExcel() {
    closeMenuDrawer();

    const monthStart = getStatementMonthStart();
    const monthParam = `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, "0")}`;
    const monthLabel = formatMonthYear(monthStart);
    const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
    const startKey = formatDateKey(monthStart);
    const endKey = formatDateKey(monthEnd);

    const exportCustomers = readCustomers();
    const exportAppointments = readAppointments();
    const customerById = new Map(exportCustomers.map((customer) => [customer?.id, customer]));
    const monthAppointments = exportAppointments
      .filter((appointment) => appointment?.entryType === "customer")
      .filter((appointment) => appointment?.dateKey >= startKey && appointment?.dateKey <= endKey)
      .slice()
      .sort((a, b) => {
        const dateCompare = String(a.dateKey || "").localeCompare(String(b.dateKey || ""));
        if (dateCompare) return dateCompare;
        return Number(a.startMinutes) - Number(b.startMinutes);
      });

    const totals = monthAppointments.reduce((acc, appointment) => {
      const cents = normalizeAmountCents(appointment?.amountCents);
      if (!cents) return acc;
      acc.billed += cents;
      if (appointment?.isPaid) acc.received += cents;
      else acc.receivables += cents;
      return acc;
    }, { billed: 0, received: 0, receivables: 0 });

    const lines = [];
    lines.push(toCsvLine(["CalAppt Monthly Statement", monthLabel]));
    lines.push(toCsvLine(["Month", monthParam]));
    lines.push(toCsvLine(["Sessions", `${monthAppointments.length}`]));
    lines.push(toCsvLine(["Money Received", formatMoneyStatement(totals.received)]));
    lines.push(toCsvLine(["Receivables", formatMoneyStatement(totals.receivables)]));
    lines.push(toCsvLine(["Monthly Total Earnings", formatMoneyStatement(totals.billed)]));
    lines.push("");
    lines.push(toCsvLine(["Date", "Weekday", "Start", "End", "Customer", "Court/Location", "Amount", "Paid", "Note"]));

    monthAppointments.forEach((appointment) => {
      const customer = customerById.get(appointment.entryId);
      const rawName = customer?.name || appointment.entryName || "Unknown Customer";
      const name = formatNameSurnameFirst(rawName) || rawName;
      const day = parseDateKey(appointment.dateKey);
      const weekday = day ? formatWeekday(day) : "";
      const startTime = Number.isFinite(appointment.startMinutes) ? formatMinutes(appointment.startMinutes) : "";
      const endTime = Number.isFinite(appointment.endMinutes) ? formatMinutes(appointment.endMinutes) : "";
      const court = String(appointment.court || "").trim();
      const amountCents = normalizeAmountCents(appointment.amountCents);
      lines.push(toCsvLine([
        appointment.dateKey || "",
        weekday,
        startTime,
        endTime,
        name,
        court,
        formatMoneyStatement(amountCents),
        appointment.isPaid ? "Yes" : "No",
        String(appointment.note || "").trim()
      ]));
    });

    const filename = `calappt-monthly-statement-${monthParam}.csv`;
    downloadCsvFile(filename, lines);
  }

  function handleExportYearlyStatementExcel() {
    closeMenuDrawer();

    const year = getStatementYear();
    const startKey = `${year}-01-01`;
    const endKey = `${year}-12-31`;

    const months = Array.from({ length: 12 }, () => ({
      billed: 0,
      received: 0,
      receivables: 0,
      count: 0
    }));

    const exportAppointments = readAppointments();
    const totals = exportAppointments
      .filter((appointment) => appointment?.entryType === "customer")
      .filter((appointment) => appointment?.dateKey >= startKey && appointment?.dateKey <= endKey)
      .reduce((acc, appointment) => {
        const cents = normalizeAmountCents(appointment?.amountCents);
        if (!cents) return acc;
        const monthIndex = Number(String(appointment.dateKey || "").slice(5, 7)) - 1;
        if (monthIndex < 0 || monthIndex > 11) return acc;

        months[monthIndex].count += 1;
        months[monthIndex].billed += cents;
        if (appointment?.isPaid) months[monthIndex].received += cents;
        else months[monthIndex].receivables += cents;

        acc.billed += cents;
        if (appointment?.isPaid) acc.received += cents;
        else acc.receivables += cents;
        return acc;
      }, { billed: 0, received: 0, receivables: 0 });

    const yearSessionCount = months.reduce((acc, month) => acc + month.count, 0);

    const lines = [];
    lines.push(toCsvLine(["CalAppt Year-End Statement", `${year}`]));
    lines.push(toCsvLine(["Year", `${year}`]));
    lines.push(toCsvLine(["Sessions", `${yearSessionCount}`]));
    lines.push(toCsvLine(["Money Received", formatMoneyStatement(totals.received)]));
    lines.push(toCsvLine(["Receivables", formatMoneyStatement(totals.receivables)]));
    lines.push(toCsvLine(["YTD Earnings", formatMoneyStatement(totals.billed)]));
    lines.push("");
    lines.push(toCsvLine(["Month", "Sessions", "Money Received", "Receivables", "Billed"]));

    months.forEach((month, index) => {
      const label = new Date(year, index, 1).toLocaleDateString(undefined, { month: "long" });
      lines.push(toCsvLine([
        label,
        `${month.count}`,
        formatMoneyStatement(month.received),
        formatMoneyStatement(month.receivables),
        formatMoneyStatement(month.billed)
      ]));
    });

    lines.push(toCsvLine([
      "Totals",
      `${yearSessionCount}`,
      formatMoneyStatement(totals.received),
      formatMoneyStatement(totals.receivables),
      formatMoneyStatement(totals.billed)
    ]));

    const filename = `calappt-year-end-statement-${year}.csv`;
    downloadCsvFile(filename, lines);
  }

  function handleEmailWeeklyAgenda() {
    closeManageDrawer({ silent: true });
    closeMenuDrawer({ silent: true });
    closeDrawer();

    const toRaw = readUserEmail();
    const to = String(toRaw || "").trim().replace(/\s+/g, "");
    if (!to) {
      window.alert("Set your email first (Menu → Email settings).");
      window.location.href = "./email-settings.html";
      return;
    }

    const weekEnd = addDays(visibleWeekStart, 6);
    const startKey = formatDateKey(visibleWeekStart);
    const endKey = formatDateKey(weekEnd);
    const weekAppointments = appointments
      .filter((appointment) => appointment.dateKey >= startKey && appointment.dateKey <= endKey)
      .slice()
      .sort((a, b) => {
        const dateCompare = a.dateKey.localeCompare(b.dateKey);
        if (dateCompare !== 0) return dateCompare;
        return a.startMinutes - b.startMinutes;
      });

    if (!weekAppointments.length) {
      window.alert("There are no appointments in the visible week to email.");
      return;
    }

    const groupedByDate = weekAppointments.reduce((acc, appointment) => {
      const key = appointment.dateKey;
      if (!acc[key]) acc[key] = [];
      acc[key].push(appointment);
      return acc;
    }, {});

    const dayKeys = Object.keys(groupedByDate).sort((a, b) => a.localeCompare(b));

    const subject = `CalAppt Weekly Agenda: ${formatMonthDay(visibleWeekStart)} - ${formatMonthDay(weekEnd)}`;
    const lines = [
      "CalAppt — Weekly Agenda",
      `${formatWeekday(visibleWeekStart)}, ${formatMonthDay(visibleWeekStart)} - ${formatWeekday(weekEnd)}, ${formatMonthDay(weekEnd)}`,
      ""
    ];

    dayKeys.forEach((dateKey) => {
      const day = parseDateKey(dateKey);
      const headerLabel = day ? `${formatWeekday(day)}, ${formatMonthDay(day)}` : dateKey;
      lines.push(headerLabel);
      (groupedByDate[dateKey] || []).forEach((appointment) => {
        const meta = getAppointmentEntryMeta(appointment);
        const court = String(appointment.court || "").trim();
        const note = appointment.note || meta.note || "";
        const timeLabel = `${formatMinutes(appointment.startMinutes)} - ${formatMinutes(appointment.endMinutes)}`;
        const detail = [court ? `Court: ${court}` : "", note].filter(Boolean).join(" \u00B7 ");
        const label = detail ? `${meta.name} — ${detail}` : meta.name;
        lines.push(`- ${timeLabel}  ${label}`);
      });
      lines.push("");
    });

    lines.push("Sent from CalAppt (opens your mail app).");

    const url = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    window.location.href = url;
  }

  function buildFeatureListLines() {
    return [
      "CALAPPT — Feature List",
      "",
      "Views & Navigation",
      "- Day view (mobile) with swipe left/right and Previous/Next buttons",
      "- Week view with Previous/Next week",
      "- Month view with month arrows and tap-to-open day",
      "- Agenda view (weekly list in day/time order)",
      "- Today button (jump back to current day/week)",
      "",
      "Scheduling",
      "- Tap a time slot to schedule (or drag-drop on desktop)",
      "- Tap an appointment to edit or delete",
      "- Current-time indicator line on today",
      "",
      "Customers",
      "- Customers drawer: add/edit customer name, cell, email, notes, sport",
      "- Customer List page: search, profile, text/email links",
      "- Bulk delete customers with checkboxes (Customer List page)",
      "- Customer Profile: edit details + see lesson history",
      "- Import contacts into customers (.vcf vCard or Google Contacts .csv)",
      "",
      "Tasks & Things To Do",
      "- Save tasks and schedule them like appointments",
      "",
      "Weather",
      "- Weekly weather in the calendar header (city label opens settings)",
      "- Weather settings page (City, ST/Prov)",
      "",
      "Backups & Export",
      "- Export Backup (.json)",
      "- Export backup + Share backup (AirDrop), Import backup (replace), and Merge backup (combine devices)",
      "- Export Google Calendar (.ics) for the visible week",
      "",
      "Admin",
      "- Autosave version history (restore older versions)",
      "- Create snapshot now",
      "- Clear autosave history / clear all app data",
      "",
      "Email & Text",
      "- Email weekly agenda (opens your mail app)",
      "- Appointment Text/Email confirmation (opens Messages/Mail)",
      "",
      "Notes",
      "- Local-first: data is saved in your browser on this device"
    ];
  }

  function handleEmailFeatureList() {
    closeManageDrawer({ silent: true });
    closeMenuDrawer({ silent: true });
    closeDrawer();

    const toRaw = readUserEmail();
    const to = String(toRaw || "").trim().replace(/\s+/g, "");
    if (!to) {
      window.alert("Set your email first (Menu → Email settings).");
      window.location.href = "./email-settings.html";
      return;
    }

    const subject = "CalAppt Feature List";
    const lines = buildFeatureListLines();
    lines.push("", "Sent from CalAppt (opens your mail app).");

    const url = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    window.location.href = url;
  }

  function shiftWeek(days) {
    visibleWeekStart = addDays(visibleWeekStart, days);
    mobileDayOffset = clampMobileDayOffset(mobileDayOffset);
    render();
    refreshWeather();
  }

  function shiftMonth(monthDelta) {
    const seed = parseDateKey(monthSelectedDateKey) || getSelectedMobileDay();
    const targetMonthStart = addMonths(getStartOfMonth(visibleMonthStart), monthDelta);
    const desiredDay = seed.getDate();

    const daysInTargetMonth = new Date(targetMonthStart.getFullYear(), targetMonthStart.getMonth() + 1, 0).getDate();
    const nextDay = Math.min(Math.max(desiredDay, 1), daysInTargetMonth);
    const nextSelected = new Date(targetMonthStart.getFullYear(), targetMonthStart.getMonth(), nextDay);
    nextSelected.setHours(0, 0, 0, 0);

    visibleMonthStart = targetMonthStart;
    monthSelectedDateKey = formatDateKey(nextSelected);
    visibleWeekStart = getStartOfWeek(nextSelected);
    mobileDayOffset = clampMobileDayOffset(
      Math.round((getStartOfDay(nextSelected).getTime() - visibleWeekStart.getTime()) / 86400000)
    );

    render();
    refreshWeather();
  }

  function jumpToToday() {
    closeManageDrawer({ silent: true });
    closeMenuDrawer({ silent: true });
    closeDrawer();

    const today = getStartOfDay(new Date());
    visibleWeekStart = getStartOfWeek(today);
    mobileDayOffset = getInitialMobileDayOffset(visibleWeekStart);

    mobileViewMode = MOBILE_VIEW_MODES.day;
    lastScheduleViewMode = MOBILE_VIEW_MODES.day;
    writeMobileViewMode(mobileViewMode);

    render();
    refreshWeather();
  }

  function handleDesktopPrevNav() {
    if (mobileViewMode === MOBILE_VIEW_MODES.month) {
      shiftMonth(-1);
      return;
    }
    if (mobileViewMode === MOBILE_VIEW_MODES.day) {
      shiftMobileDay(-1);
      return;
    }
    shiftWeek(-7);
  }

  function handleDesktopNextNav() {
    if (mobileViewMode === MOBILE_VIEW_MODES.month) {
      shiftMonth(1);
      return;
    }
    if (mobileViewMode === MOBILE_VIEW_MODES.day) {
      shiftMobileDay(1);
      return;
    }
    shiftWeek(7);
  }

  function handleDesktopMonthViewToggle() {
    closeManageDrawer({ silent: true });
    closeMenuDrawer({ silent: true });
    closeDrawer();

    if (mobileViewMode === MOBILE_VIEW_MODES.month) return;
    setMobileViewMode(MOBILE_VIEW_MODES.month);
  }

  function handleMobilePrevNav() {
    if (mobileViewMode === MOBILE_VIEW_MODES.week || mobileViewMode === MOBILE_VIEW_MODES.agenda) {
      shiftWeek(-7);
      return;
    }
    if (mobileViewMode === MOBILE_VIEW_MODES.month) {
      shiftMonth(-1);
      return;
    }
    shiftMobileDay(-1);
  }

  function handleMobileNextNav() {
    if (mobileViewMode === MOBILE_VIEW_MODES.week || mobileViewMode === MOBILE_VIEW_MODES.agenda) {
      shiftWeek(7);
      return;
    }
    if (mobileViewMode === MOBILE_VIEW_MODES.month) {
      shiftMonth(1);
      return;
    }
    shiftMobileDay(1);
  }

  function shiftMobileDay(dayDelta) {
    let nextOffset = mobileDayOffset + dayDelta;
    let weekShift = 0;

    while (nextOffset < 0) {
      nextOffset += 7;
      weekShift -= 7;
    }

    while (nextOffset > 6) {
      nextOffset -= 7;
      weekShift += 7;
    }

    mobileDayOffset = nextOffset;

    if (weekShift !== 0) {
      visibleWeekStart = addDays(visibleWeekStart, weekShift);
      render();
      refreshWeather();
      return;
    }

    render();
  }

  function handleMobileViewportChange() {
    mobileDayOffset = clampMobileDayOffset(mobileDayOffset);
    render();
  }

  function handleAgendaButtonClick() {
    closeManageDrawer({ silent: true });
    closeMenuDrawer({ silent: true });
    closeDrawer();

    if (mobileViewMode === MOBILE_VIEW_MODES.agenda) return;
    setMobileViewMode(MOBILE_VIEW_MODES.agenda);
  }

  function handleMobileViewSelectChange() {
    const value = String(elements.mobileViewSelect?.value || "").toLowerCase();

    closeManageDrawer({ silent: true });
    closeMenuDrawer({ silent: true });
    closeDrawer();

    if (value === "today") {
      jumpToToday();
      return;
    }
    if (value === MOBILE_VIEW_MODES.agenda) {
      setMobileViewMode(MOBILE_VIEW_MODES.agenda);
      return;
    }
    if (value === MOBILE_VIEW_MODES.month) {
      setMobileViewMode(MOBILE_VIEW_MODES.month);
      return;
    }
    if (value === MOBILE_VIEW_MODES.week) {
      setMobileViewMode(MOBILE_VIEW_MODES.week);
      return;
    }
    setMobileViewMode(MOBILE_VIEW_MODES.day);
  }

  function setMobileViewMode(mode) {
    const nextMode = mode === MOBILE_VIEW_MODES.agenda
      ? MOBILE_VIEW_MODES.agenda
      : (mode === MOBILE_VIEW_MODES.month
        ? MOBILE_VIEW_MODES.month
        : (mode === MOBILE_VIEW_MODES.week ? MOBILE_VIEW_MODES.week : MOBILE_VIEW_MODES.day));
    if (mobileViewMode === nextMode) return;

    if (nextMode !== MOBILE_VIEW_MODES.agenda) {
      lastScheduleViewMode = nextMode;
    }

    if (nextMode === MOBILE_VIEW_MODES.month) {
      const seed = getSelectedMobileDay();
      visibleMonthStart = getStartOfMonth(seed);
      monthSelectedDateKey = formatDateKey(seed);
    }

    mobileViewMode = nextMode;
    writeMobileViewMode(mobileViewMode);
    render();
  }

  function syncMobileLayoutState() {
    document.body.classList.toggle(
      "is-month-view",
      mobileViewMode === MOBILE_VIEW_MODES.month
    );
    document.body.classList.toggle(
      "is-mobile-week-view",
      isMobileLayout() && mobileViewMode === MOBILE_VIEW_MODES.week
    );
  }

  function attachMobileSwipeNavigation() {
    const swipeTargets = [elements.mobileDayBar, elements.calendarGrid].filter(Boolean);
    if (!swipeTargets.length) return;

    const supportsPointer = typeof window.PointerEvent === "function";
    const supportsTouchEvents = ("ontouchstart" in window) || (navigator.maxTouchPoints > 0);

    const shouldIgnoreTarget = (target) => Boolean(target?.closest?.("a, input, select, textarea, label"));

    const SWIPE_DISTANCE = 24;
    const SWIPE_DISTANCE_QUICK = 16;
    const SWIPE_QUICK_MS = 220;
    const HORIZONTAL_RATIO = 1.05;
    const HORIZONTAL_RATIO_QUICK = 1.2;
    const LOCK_DEADZONE = 8;
    const SCROLL_SUPPRESS_THRESHOLD = 10;

    const attachToTarget = (target) => {
      let startX = 0;
      let startY = 0;
      let lastX = 0;
      let lastY = 0;
      let startedAt = 0;
      let lockedAxis = null;
      let committed = false;
      let activePointerId = null;

      const reset = () => {
        startX = 0;
        startY = 0;
        lastX = 0;
        lastY = 0;
        startedAt = 0;
        lockedAxis = null;
        committed = false;
        activePointerId = null;
      };

      const tryCommitSwipe = (clientX, clientY, { forceQuick = false } = {}) => {
        if (committed) return false;
        if (!isMobileLayout() || mobileViewMode !== MOBILE_VIEW_MODES.day) return false;
        if (!startedAt) return false;

        const dx = clientX - startX;
        const dy = clientY - startY;
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);
        const elapsed = Date.now() - startedAt;

        const ratio = forceQuick ? HORIZONTAL_RATIO_QUICK : HORIZONTAL_RATIO;
        const distanceThreshold = forceQuick ? SWIPE_DISTANCE_QUICK : SWIPE_DISTANCE;
        if (absX < distanceThreshold) return false;
        if (absX < absY * ratio) return false;

        // Avoid accidental "micro" swipes if the user is slowly panning.
        if (!forceQuick && elapsed > 900) return false;

        committed = true;
        lastSwipeAt = Date.now();
        shiftMobileDay(dx < 0 ? 1 : -1);
        return true;
      };

      const onStart = (clientX, clientY) => {
        startX = clientX;
        startY = clientY;
        lastX = clientX;
        lastY = clientY;
        startedAt = Date.now();
        lockedAxis = null;
        committed = false;
      };

      const onMove = (clientX, clientY, event) => {
        if (!startedAt || committed) return;
        lastX = clientX;
        lastY = clientY;

        const dx = lastX - startX;
        const dy = lastY - startY;
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);

        if (!lockedAxis) {
          if (absX < LOCK_DEADZONE && absY < LOCK_DEADZONE) return;
          if (absX >= SCROLL_SUPPRESS_THRESHOLD && absX > absY) lockedAxis = "x";
          else if (absY >= SCROLL_SUPPRESS_THRESHOLD && absY > absX) lockedAxis = "y";
          else return;
        }

        if (lockedAxis !== "x") return;

        // Once we know it's a horizontal gesture, suppress scrolling so Safari
        // doesn't cancel the gesture (makes swiping feel much easier).
        if (event?.cancelable) {
          event.preventDefault();
        }

        // Commit as soon as the user crosses the swipe threshold.
        if (absX >= SWIPE_DISTANCE) {
          tryCommitSwipe(lastX, lastY);
          return;
        }

        const elapsed = Date.now() - startedAt;
        if (elapsed <= SWIPE_QUICK_MS) {
          tryCommitSwipe(lastX, lastY, { forceQuick: true });
        }
      };

      const onEnd = (clientX, clientY) => {
        if (!startedAt) return;
        const elapsed = Date.now() - startedAt;
        if (!committed && elapsed <= SWIPE_QUICK_MS) {
          tryCommitSwipe(clientX, clientY, { forceQuick: true });
        }
        if (!committed) {
          tryCommitSwipe(clientX, clientY);
        }
        reset();
      };

      const onCancel = () => {
        reset();
      };

      if (supportsTouchEvents) {
        target.addEventListener("touchstart", (event) => {
          if (!isMobileLayout() || mobileViewMode !== MOBILE_VIEW_MODES.day) return;
          const touch = event.changedTouches?.[0];
          if (!touch) return;
          if (shouldIgnoreTarget(event.target)) return;
          onStart(touch.clientX, touch.clientY);
        }, { passive: true });

        target.addEventListener("touchmove", (event) => {
          const touch = event.changedTouches?.[0];
          if (!touch) return;
          if (shouldIgnoreTarget(event.target)) return;
          onMove(touch.clientX, touch.clientY, event);
        }, { passive: false });

        target.addEventListener("touchend", (event) => {
          const touch = event.changedTouches?.[0];
          if (!touch) return;
          if (shouldIgnoreTarget(event.target)) return;
          onEnd(touch.clientX, touch.clientY);
        }, { passive: true });

        target.addEventListener("touchcancel", onCancel, { passive: true });
        return;
      }

      if (!supportsPointer) return;

      target.addEventListener("pointerdown", (event) => {
        if (!isMobileLayout() || mobileViewMode !== MOBILE_VIEW_MODES.day) return;
        if (event.pointerType !== "touch") return;
        if (shouldIgnoreTarget(event.target)) return;
        activePointerId = event.pointerId;
        try {
          target.setPointerCapture(event.pointerId);
        } catch {}
        onStart(event.clientX, event.clientY);
      }, { passive: true });

      target.addEventListener("pointermove", (event) => {
        if (event.pointerType !== "touch") return;
        if (activePointerId !== null && event.pointerId !== activePointerId) return;
        if (shouldIgnoreTarget(event.target)) return;
        onMove(event.clientX, event.clientY, event);
      }, { passive: true });

      target.addEventListener("pointerup", (event) => {
        if (event.pointerType !== "touch") return;
        if (activePointerId !== null && event.pointerId !== activePointerId) return;
        if (shouldIgnoreTarget(event.target)) return;
        onEnd(event.clientX, event.clientY);
      }, { passive: true });

      target.addEventListener("pointercancel", onCancel, { passive: true });
    };

    swipeTargets.forEach(attachToTarget);
  }

  function handleVisibilityChange() {
    autoBackupEnabled = readAutoBackupEnabled();
    if (document.visibilityState === "hidden") {
      runAutoBackup({ force: true });
      return;
    }
    if (document.visibilityState !== "visible") return;
    syncWeatherCityFromStorage();
    updateNowIndicator();
  }

  function syncWeatherCityFromStorage() {
    const storedCity = readWeatherCity();
    if (storedCity === weatherState.city) return;
    weatherState = { ...weatherState, city: storedCity };
    scheduleAutoBackup();
    renderMobileDayBar();
    refreshWeather();
  }

  function handleSportsSync() {
    sports = readSports();
    renderSports();
    renderCustomers();
    renderCalendar();
  }

  function handleSportsStorageSync(event) {
    if (event.key && event.key !== STORAGE_KEYS.sports) return;
    handleSportsSync();
  }

  function clearDropTargets() {
    Array.from(document.querySelectorAll(".time-slot.is-drop-target")).forEach((slot) => {
      slot.classList.remove("is-drop-target");
    });
  }

  function lockBodyScroll() {
    if (document.body.classList.contains("is-drawer-open")) return;

    lockedScrollY = window.scrollY || window.pageYOffset || 0;
    document.documentElement.classList.add("is-drawer-open");
    document.body.classList.add("is-drawer-open");
    document.body.style.position = "fixed";
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
  }

  function unlockBodyScroll() {
    if (!document.body.classList.contains("is-drawer-open")) return;

    document.documentElement.classList.remove("is-drawer-open");
    document.body.classList.remove("is-drawer-open");
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";

    window.scrollTo(0, lockedScrollY || 0);
    lockedScrollY = 0;
  }

  function populateTimeSelect(select) {
    if (!select) return;
    select.innerHTML = TIME_OPTIONS.map((option) => `
      <option value="${option.minutes}">${escapeHtml(option.label)}</option>
    `).join("");
  }

  function populateSportIconSelect(select) {
    if (!select) return;
    select.innerHTML = SPORT_ICON_CHOICES.map((option) => `
      <option value="${option.value}">${escapeHtml(option.label)}</option>
    `).join("");
  }

  function isDemoDisabled() {
    try {
      return window.localStorage.getItem(DEMO_KEYS.disabled) === "true";
    } catch {
      return false;
    }
  }

  function safeSeedLocalStorageJson(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  function buildDemoAppointments(referenceDate = new Date()) {
    const weekStart = getStartOfWeek(referenceDate);
    const specs = [
      { customerId: "c5", dayOffset: 0, startMinutes: 8 * 60, endMinutes: 9 * 60, court: "Court 1", note: "Backhand confidence rebuild", amountCents: 6000, isPaid: true },
      { customerId: "c1", dayOffset: 1, startMinutes: 9 * 60, endMinutes: 10 * 60, court: "Court 2", note: "Serve tune-up", amountCents: 5500, isPaid: false },
      { customerId: "c3", dayOffset: 2, startMinutes: 11 * 60, endMinutes: 12 * 60 + 30, court: "Court 1", note: "Footwork + spacing reps", amountCents: 7000, isPaid: true },
      { customerId: "c2", dayOffset: 3, startMinutes: 16 * 60, endMinutes: 17 * 60, court: "Court 3", note: "Forehand block fundamentals", amountCents: 5500, isPaid: false },
      { customerId: "c4", dayOffset: 4, startMinutes: 18 * 60, endMinutes: 19 * 60, court: "Field A", note: "Match prep + set pieces", amountCents: 6500, isPaid: false },
      { customerId: "c6", dayOffset: 5, startMinutes: 10 * 60, endMinutes: 11 * 60, court: "Court 2", note: "High-performance hour", amountCents: 6000, isPaid: true }
    ];

    return specs.map((spec) => ({
      id: createId("appointment"),
      entryType: "customer",
      entryId: spec.customerId,
      entryName: "",
      entryNote: "",
      dateKey: formatDateKey(addDays(weekStart, spec.dayOffset)),
      startMinutes: spec.startMinutes,
      endMinutes: spec.endMinutes,
      court: spec.court,
      note: spec.note,
      amountCents: spec.amountCents,
      isPaid: spec.isPaid
    }));
  }

  function maybeSeedDemoData() {
    if (isDemoDisabled()) return;

    let customersRaw = null;
    try {
      customersRaw = window.localStorage.getItem(STORAGE_KEYS.customers);
    } catch {
      return;
    }

    if (customersRaw !== null) return;

    const seededCustomers = DEFAULT_CUSTOMERS.slice().map(normalizeCustomer);
    const seededSports = DEFAULT_SPORTS.slice().map(normalizeSport);
    const seededAppointments = buildDemoAppointments(new Date()).map(normalizeAppointment).filter(Boolean);

    safeSeedLocalStorageJson(STORAGE_KEYS.customers, seededCustomers);
    safeSeedLocalStorageJson(STORAGE_KEYS.sports, seededSports);
    safeSeedLocalStorageJson(STORAGE_KEYS.appointments, seededAppointments);
    safeSeedLocalStorageJson(STORAGE_KEYS.tasks, []);

    try {
      window.localStorage.setItem(STORAGE_KEYS.leftMode, "customers");
      window.localStorage.setItem(STORAGE_KEYS.selectedCustomerId, seededCustomers[0]?.id || "");
    } catch {}
  }

  function readCustomers() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.customers);
      if (raw === null) return [];
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.map(normalizeCustomer) : [];
    } catch {
      return [];
    }
  }

  function readSports() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.sports);
      if (raw === null) {
        if (isDemoDisabled()) return [];
        const seededSports = DEFAULT_SPORTS.slice().map(normalizeSport);
        safeSeedLocalStorageJson(STORAGE_KEYS.sports, seededSports);
        return seededSports;
      }
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.map(normalizeSport) : [];
    } catch {
      return [];
    }
  }

  function readAppointments() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.appointments);
      if (raw === null) return [];
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.map(normalizeAppointment).filter(Boolean) : [];
    } catch {
      return [];
    }
  }

  function readTasks() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.tasks);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.map(normalizeTask) : [];
    } catch {
      return [];
    }
  }

  function readWeatherCity() {
    try {
      return window.localStorage.getItem(STORAGE_KEYS.weatherCity) || "";
    } catch {
      return "";
    }
  }

  function readUserEmail() {
    try {
      return window.localStorage.getItem(STORAGE_KEYS.userEmail) || "";
    } catch {
      return "";
    }
  }

  function readAutoBackupEnabled() {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEYS.autoBackupEnabled);
      if (saved === "false") return false;
      if (saved === "true") return true;
      return true;
    } catch {
      return true;
    }
  }

  function readAutoBackups() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.autoBackups);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function readLeftPanelMode() {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEYS.leftMode);
      return saved === "tasks" ? "tasks" : "customers";
    } catch {
      return "customers";
    }
  }

  function readSelectedCustomerId() {
    try {
      return window.localStorage.getItem(STORAGE_KEYS.selectedCustomerId) || "";
    } catch {
      return "";
    }
  }

  function readMobileViewMode() {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEYS.mobileViewMode);
      if (saved === MOBILE_VIEW_MODES.agenda) return MOBILE_VIEW_MODES.agenda;
      if (saved === MOBILE_VIEW_MODES.month) return MOBILE_VIEW_MODES.month;
      return saved === MOBILE_VIEW_MODES.week ? MOBILE_VIEW_MODES.week : MOBILE_VIEW_MODES.day;
    } catch {
      return MOBILE_VIEW_MODES.day;
    }
  }

  function writeCustomers() {
    if (safeLocalStorageSet(STORAGE_KEYS.customers, JSON.stringify(customers))) {
      scheduleAutoBackup();
    }
  }

  function writeSports() {
    if (safeLocalStorageSet(STORAGE_KEYS.sports, JSON.stringify(sports))) {
      scheduleAutoBackup();
    }
  }

  function writeTasks() {
    if (safeLocalStorageSet(STORAGE_KEYS.tasks, JSON.stringify(tasks))) {
      scheduleAutoBackup();
    }
  }

  function writeAppointments() {
    if (safeLocalStorageSet(STORAGE_KEYS.appointments, JSON.stringify(appointments))) {
      scheduleAutoBackup();
    }
  }

  function writeWeatherCity(city) {
    if (safeLocalStorageSet(STORAGE_KEYS.weatherCity, city)) {
      scheduleAutoBackup();
    }
  }

  function writeUserEmail(email) {
    if (safeLocalStorageSet(STORAGE_KEYS.userEmail, email || "")) {
      scheduleAutoBackup();
    }
  }

  function writeAutoBackupEnabled(enabled) {
    safeLocalStorageSet(STORAGE_KEYS.autoBackupEnabled, enabled ? "true" : "false");
  }

  function writeAutoBackups(backups) {
    safeLocalStorageSet(STORAGE_KEYS.autoBackups, JSON.stringify(backups || []));
  }

  function writeLeftPanelMode(mode) {
    safeLocalStorageSet(STORAGE_KEYS.leftMode, mode);
  }

  function writeSelectedCustomerId(customerId) {
    safeLocalStorageSet(STORAGE_KEYS.selectedCustomerId, customerId || "");
  }

  function writeMobileViewMode(mode) {
    safeLocalStorageSet(STORAGE_KEYS.mobileViewMode, mode);
  }

  function buildTimeOptions(startMinutes, endMinutes, step) {
    const options = [];
    for (let minutes = startMinutes; minutes <= endMinutes; minutes += step) {
      options.push({
        minutes,
        label: formatMinutes(minutes)
      });
    }
    return options;
  }

  function getStartOfWeek(date) {
    const next = new Date(date);
    next.setHours(0, 0, 0, 0);
    const day = next.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    next.setDate(next.getDate() + diff);
    return next;
  }

  function getStartOfMonth(date) {
    const next = new Date(date);
    next.setHours(0, 0, 0, 0);
    next.setDate(1);
    return next;
  }

  function addDays(date, amount) {
    const next = new Date(date);
    next.setDate(next.getDate() + amount);
    return next;
  }

  function addMonths(date, amount) {
    const next = new Date(date);
    const desiredDate = next.getDate();
    next.setDate(1);
    next.setMonth(next.getMonth() + amount);
    const daysInTargetMonth = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
    next.setDate(Math.min(desiredDate, daysInTargetMonth));
    return next;
  }

  function getVisibleCalendarDays() {
    if (mobileViewMode === MOBILE_VIEW_MODES.day) {
      return [getSelectedMobileDay()];
    }

    return Array.from({ length: 7 }, (_, index) => addDays(visibleWeekStart, index));
  }

  function getSelectedMobileDay() {
    return addDays(visibleWeekStart, clampMobileDayOffset(mobileDayOffset));
  }

  function getInitialMobileDayOffset(weekStart) {
    const today = getStartOfDay(new Date());
    const start = getStartOfDay(weekStart);
    const diff = Math.round((today.getTime() - start.getTime()) / 86400000);
    return diff >= 0 && diff <= 6 ? diff : 0;
  }

  function clampMobileDayOffset(value) {
    return Math.min(Math.max(value, 0), 6);
  }

  function isMobileLayout() {
    return mobileMediaQuery.matches;
  }

  function getStartOfDay(date) {
    const next = new Date(date);
    next.setHours(0, 0, 0, 0);
    return next;
  }

  function formatDateKey(date) {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function parseDateKey(value) {
    if (!value) return null;
    const [year, month, day] = value.split("-").map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
  }

  function formatWeekday(date) {
    return date.toLocaleDateString(undefined, { weekday: "short" });
  }

  function formatMonthDay(date) {
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  function formatMonthYear(date) {
    return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  }

  function formatVisibleMonthRange(start, end) {
    const sameMonth = start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth();
    if (sameMonth) {
      return start.toLocaleDateString(undefined, { month: "long", year: "numeric" });
    }

    const sameYear = start.getFullYear() === end.getFullYear();
    if (sameYear) {
      return `${start.toLocaleDateString(undefined, { month: "short" })} - ${end.toLocaleDateString(undefined, { month: "short", year: "numeric" })}`;
    }

    return `${start.toLocaleDateString(undefined, { month: "short", year: "numeric" })} - ${end.toLocaleDateString(undefined, { month: "short", year: "numeric" })}`;
  }

  function formatMinutes(minutes) {
    const hours24 = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const suffix = hours24 >= 12 ? "PM" : "AM";
    const hours12 = hours24 % 12 || 12;
    return `${hours12}:${String(mins).padStart(2, "0")} ${suffix}`;
  }

  function formatMinutesRange(startMinutes, endMinutes) {
    const startHours24 = Math.floor(startMinutes / 60);
    const startMins = startMinutes % 60;
    const endHours24 = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    const startSuffix = startHours24 >= 12 ? "PM" : "AM";
    const endSuffix = endHours24 >= 12 ? "PM" : "AM";
    const startHours12 = startHours24 % 12 || 12;
    const endHours12 = endHours24 % 12 || 12;

    if (startSuffix === endSuffix) {
      return `${startHours12}:${String(startMins).padStart(2, "0")}-${endHours12}:${String(endMins).padStart(2, "0")} ${endSuffix}`;
    }

    return `${formatMinutes(startMinutes)}-${formatMinutes(endMinutes)}`;
  }

  function isToday(date) {
    return formatDateKey(date) === formatDateKey(new Date());
  }

  function createId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function clampMinutes(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function buildDateFromMinutes(dateKey, minutes) {
    const date = parseDateKey(dateKey);
    if (!date) return new Date();
    date.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
    return date;
  }

  function formatICSDateTime(date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
  }

  function escapeICSText(value) {
    return String(value)
      .replaceAll("\\", "\\\\")
      .replaceAll("\n", "\\n")
      .replaceAll(",", "\\,")
      .replaceAll(";", "\\;");
  }

  function downloadTextFile(filename, contents, mimeType) {
    const blob = new Blob([contents], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function valueOf(element) {
    return element?.value?.trim?.() || "";
  }

  function parseAmountToCents(value) {
    const raw = String(value || "").trim();
    if (!raw) return 0;
    const normalized = raw.replace(/[^0-9.-]/g, "");
    const number = Number(normalized);
    if (!Number.isFinite(number) || number <= 0) return 0;
    return Math.round(number * 100);
  }

  function formatCentsForInput(cents) {
    const amountCents = Number(cents);
    if (!Number.isFinite(amountCents) || amountCents <= 0) return "";
    return (amountCents / 100).toFixed(2);
  }

  function safeLocalStorageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch {
      if (!storageErrorShown) {
        storageErrorShown = true;
        window.alert("Storage is full or unavailable on this device. Try Admin → Clear autosave history, or Export Backup and clear old data.");
      }
      return false;
    }
  }

  function sanitizePhoneForSms(value) {
    return String(value || "").trim().replace(/[^\d+.-]/g, "");
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function splitNameForSurnameSort(value) {
    const name = String(value || "").trim();
    const sentinel = "\uffff";
    if (!name) {
      return { surname: sentinel, given: sentinel, full: sentinel };
    }

    const commaIndex = name.indexOf(",");
    if (commaIndex !== -1) {
      const surname = name.slice(0, commaIndex).trim() || sentinel;
      const given = name.slice(commaIndex + 1).trim() || sentinel;
      return { surname, given, full: name };
    }

    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length <= 1) {
      return { surname: parts[0] || sentinel, given: sentinel, full: name };
    }

    const surname = parts[parts.length - 1] || sentinel;
    const given = parts.slice(0, -1).join(" ").trim() || sentinel;
    return { surname, given, full: name };
  }

  function formatNameSurnameFirst(value) {
    const raw = String(value || "").trim();
    if (!raw) return "";

    const sentinel = "\uffff";
    const parsed = splitNameForSurnameSort(raw);
    if (!parsed || parsed.full === sentinel) return raw;
    if (!parsed.given || parsed.given === sentinel) return raw;

    if (String(parsed.surname || "").trim().toLowerCase() === "customer") return raw;

    return `${parsed.surname}, ${parsed.given}`;
  }

  function compareNamesBySurname(leftName, rightName) {
    const left = splitNameForSurnameSort(leftName);
    const right = splitNameForSurnameSort(rightName);

    const surnameCompare = String(left.surname).localeCompare(String(right.surname), undefined, { sensitivity: "base" });
    if (surnameCompare) return surnameCompare;

    const givenCompare = String(left.given).localeCompare(String(right.given), undefined, { sensitivity: "base" });
    if (givenCompare) return givenCompare;

    return String(left.full).localeCompare(String(right.full), undefined, { sensitivity: "base" });
  }

  function compareCustomersBySurname(left, right) {
    const comparison = compareNamesBySurname(left?.name, right?.name);
    if (comparison) return comparison;
    return String(left?.id || "").localeCompare(String(right?.id || ""));
  }

  function getCustomerColor(id) {
    const palette = ["#b5ff3d", "#ffb84d", "#49dcb1", "#6fb8ff", "#f484c4", "#ffd74d"];
    const hash = String(id).split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return palette[hash % palette.length];
  }

  function getSportById(sportId) {
    if (!sportId) return null;
    return sports.find((sport) => sport.id === sportId) || null;
  }

  function getSportIconLabel(iconKey) {
    return SPORT_ICON_CHOICES.find((choice) => choice.value === iconKey)?.label || "Sport";
  }

  function getValidSportIconKey(iconKey) {
    return SPORT_ICON_CHOICES.some((choice) => choice.value === iconKey)
      ? iconKey
      : SPORT_ICON_CHOICES[0].value;
  }

  function normalizeHexColor(value, fallback) {
    const candidate = String(value || "").trim();
    return /^#[0-9a-fA-F]{6}$/.test(candidate) ? candidate : fallback;
  }

  function normalizeCustomIconData(value) {
    const candidate = String(value || "").trim();
    return candidate.startsWith("data:image/") ? candidate : "";
  }

  function normalizeCustomIconName(value) {
    return String(value || "").trim();
  }

  function renderSportVisualMarkup(sport) {
    if (sport?.customIconData) {
      return `<img class="sport-custom-icon" src="${escapeHtml(sport.customIconData)}" alt="">`;
    }
    return renderSportIconSvg(sport?.iconKey);
  }

  function renderSportIconSvg(iconKey) {
    const normalized = getValidSportIconKey(iconKey);
    const icons = {
      tennis: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7.25"></circle><path d="M7.4 8.2c2.2 1.1 3.9 3.1 4.8 5.5"></path><path d="M16.6 8.2c-2.2 1.1-3.9 3.1-4.8 5.5"></path></svg>`,
      pickleball: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 6.5h4.8a2 2 0 0 1 2 2v5.1a2 2 0 0 1-2 2H8.5a2 2 0 0 1-2-2V8.5a2 2 0 0 1 2-2Z"></path><path d="M15.3 14.7l2.8 2.8"></path><circle cx="10" cy="9.5" r="0.8" fill="currentColor" stroke="none"></circle><circle cx="12.8" cy="9.5" r="0.8" fill="currentColor" stroke="none"></circle><circle cx="10" cy="12.3" r="0.8" fill="currentColor" stroke="none"></circle></svg>`,
      soccer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7.4"></circle><path d="m12 8.1 2.4 1.7-.9 2.8h-3l-.9-2.8L12 8.1Z"></path><path d="m9.5 15 2.5-1.8 2.5 1.8"></path><path d="M7.5 10.4 9.4 9"></path><path d="M16.5 10.4 14.6 9"></path></svg>`,
      basketball: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7.5"></circle><path d="M12 4.5c1.8 2.4 2.8 4.9 2.8 7.5S13.8 17.1 12 19.5"></path><path d="M12 4.5c-1.8 2.4-2.8 4.9-2.8 7.5s1 5.1 2.8 7.5"></path><path d="M4.8 9.4c2.2.8 4.6 1.1 7.2 1.1s5-.3 7.2-1.1"></path><path d="M4.8 14.6c2.2-.8 4.6-1.1 7.2-1.1s5 .3 7.2 1.1"></path></svg>`,
      baseball: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7.4"></circle><path d="M8.6 7.6c1.5 1.5 2.4 3.4 2.4 5.4s-.9 3.9-2.4 5.4"></path><path d="M15.4 7.6c-1.5 1.5-2.4 3.4-2.4 5.4s.9 3.9 2.4 5.4"></path><path d="m8 9.1 1.1.9"></path><path d="m7.4 11 1.3.8"></path><path d="m16 9.1-1.1.9"></path><path d="m16.6 11-1.3.8"></path></svg>`,
      hockey: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 6.5 8 15.8"></path><path d="M14.2 6.5 12.7 15.8"></path><path d="M7.2 16h8.6c.9 0 1.6.7 1.6 1.6v.4H6.1v-.4c0-.9.7-1.6 1.1-1.6Z"></path><path d="m16.7 7.5 1.7 2.1"></path></svg>`,
      swim: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><circle cx="8.2" cy="8.2" r="2"></circle><path d="m10.5 10.2 2.6 1.3 1.4 2.4"></path><path d="M4.5 16c1 .7 2 .7 3 0s2-.7 3 0 2 .7 3 0 2-.7 3 0 2 .7 3 0"></path><path d="M5.4 12.6 8 11l2.2 1.1"></path></svg>`,
      fitness: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 10.5h2.2v3H4.5z"></path><path d="M17.3 10.5h2.2v3h-2.2z"></path><path d="M6.7 11.2h2.2v1.6H6.7z"></path><path d="M15.1 11.2h2.2v1.6h-2.2z"></path><path d="M8.9 12h6.2"></path><path d="m10 9.2 1 2.8"></path><path d="m14 9.2-1 2.8"></path></svg>`
    };
    return icons[normalized] || icons.tennis;
  }

  function renderWeatherStatus() {
    if (!elements.weatherStatus) return;

    if (weatherState.loading) {
      elements.weatherStatus.textContent = "Loading weather";
      return;
    }

    if (weatherState.error) {
      elements.weatherStatus.textContent = weatherState.error;
      return;
    }

    if (weatherState.label) {
      elements.weatherStatus.textContent = weatherState.label;
      return;
    }

    elements.weatherStatus.textContent = "Weather off";
  }

  function normalizeCustomer(customer) {
    return {
      id: customer.id || createId("customer"),
      name: customer.name || "Unnamed Customer",
      sportId: customer.sportId || "",
      cell: customer.cell || "",
      email: customer.email || "",
      note: customer.note || "",
      isSample: Boolean(customer.isSample)
    };
  }

  function normalizeSport(sport) {
    return {
      id: sport.id || createId("sport"),
      name: sport.name || "Unnamed Sport",
      iconKey: getValidSportIconKey(sport.iconKey),
      color: normalizeHexColor(sport.color, "#49dcb1"),
      customIconData: normalizeCustomIconData(sport.customIconData),
      customIconName: normalizeCustomIconName(sport.customIconName)
    };
  }

  function normalizeTask(task) {
    return {
      id: task.id || createId("task"),
      name: task.name || "Untitled Task",
      note: task.note || ""
    };
  }

  function normalizeAmountCents(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return 0;
    return Math.max(0, Math.round(number));
  }

  function normalizeAppointment(appointment) {
    if (!appointment || !appointment.dateKey) return null;

    const entryType = appointment.entryType || "customer";
    const entryId = appointment.entryId || appointment.customerId || "";
    const entryName = appointment.entryName || "";
    const entryNote = appointment.entryNote || "";
    const startMinutes = Number(appointment.startMinutes);
    const endMinutes = Number(appointment.endMinutes);
    const hasSubject = entryId || (entryType === "task" && entryName);
    if (!hasSubject || !Number.isFinite(startMinutes) || !Number.isFinite(endMinutes)) return null;

    return {
      id: appointment.id || createId("appointment"),
      entryType,
      entryId,
      entryName,
      entryNote,
      dateKey: appointment.dateKey,
      startMinutes,
      endMinutes,
      court: appointment.court || "",
      note: appointment.note || "",
      amountCents: normalizeAmountCents(appointment.amountCents),
      isPaid: Boolean(appointment.isPaid)
    };
  }

  function setLeftPanelMode(mode) {
    leftPanelMode = mode === "tasks" ? "tasks" : "customers";
    writeLeftPanelMode(leftPanelMode);
    renderLeftPanel();
    renderMobileDayBar();
  }

  function getActiveScheduleSelection() {
    if (leftPanelMode === "tasks") {
      if (selectedTaskId) {
        const selectedTask = tasks.find((task) => task.id === selectedTaskId);
        return selectedTask
          ? { type: "task", id: selectedTaskId, name: selectedTask.name, note: selectedTask.note || "" }
          : null;
      }

      const draftTaskName = valueOf(elements.taskName);
      if (draftTaskName) {
        return { type: "task", id: "", name: draftTaskName, note: "" };
      }

      return null;
    }
    if (!selectedCustomerId) return null;
    const selectedCustomer = customers.find((customer) => customer.id === selectedCustomerId);
    return selectedCustomer
      ? { type: "customer", id: selectedCustomerId, name: selectedCustomer.name, note: selectedCustomer.note || "" }
      : null;
  }

  function parseDraggedSelection(value) {
    if (!value) return null;
    try {
      const parsed = JSON.parse(value);
      if (parsed?.type) {
        return {
          type: parsed.type,
          id: parsed.id || "",
          name: parsed.name || "",
          note: parsed.note || ""
        };
      }
    } catch {}

    const [type, id] = value.split(":");
    if (!type || !id) return null;
    return { type, id, name: "", note: "" };
  }

  function getScheduleSubject(entryType, entryId, fallbackName = "", fallbackNote = "") {
    if (entryType === "task") {
      return tasks.find((entry) => entry.id === entryId)
        || (fallbackName ? { id: entryId || "", name: fallbackName, note: fallbackNote || "" } : null);
    }
    return customers.find((entry) => entry.id === entryId)
      || (fallbackName ? { id: entryId || "", name: fallbackName, note: fallbackNote || "" } : null);
  }

  function getAppointmentEntryMeta(appointment) {
    const subject = getScheduleSubject(appointment.entryType, appointment.entryId, appointment.entryName, appointment.entryNote);
    if (appointment.entryType === "task") {
      return {
        name: subject?.name || "Task",
        note: subject?.note || "",
        color: TASK_COLOR,
        iconMarkup: "",
        iconColor: TASK_COLOR
      };
    }

    return {
      name: subject?.name || "Unknown Customer",
      note: subject?.note || "",
      color: getCustomerColor(appointment.entryId),
      iconMarkup: "",
      iconColor: getCustomerColor(appointment.entryId)
    };
  }

  function hexToRgba(hex, alpha) {
    const normalized = hex.replace("#", "");
    const expanded = normalized.length === 3
      ? normalized.split("").map((char) => char + char).join("")
      : normalized;
    const red = Number.parseInt(expanded.slice(0, 2), 16);
    const green = Number.parseInt(expanded.slice(2, 4), 16);
    const blue = Number.parseInt(expanded.slice(4, 6), 16);
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  async function refreshWeather() {
    const city = weatherState.city;
    if (!city) {
      weatherState = {
        ...weatherState,
        label: "",
        loading: false,
        error: "",
        dailyByDate: {}
      };
      render();
      return;
    }

    weatherState = {
      ...weatherState,
      loading: true,
      error: "",
      label: city,
      dailyByDate: {}
    };
    renderDesktopToolbarWeather();
    renderWeatherStatus();
    renderCalendar();

    try {
      const location = await fetchWeatherLocation(city);
      const dailyByDate = await fetchWeeklyWeather(location);
      weatherState = {
        ...weatherState,
        loading: false,
        error: "",
        label: location.label,
        dailyByDate
      };
    } catch (error) {
      weatherState = {
        ...weatherState,
        loading: false,
        error: "Weather unavailable",
        label: city,
        dailyByDate: {}
      };
    }

    renderDesktopToolbarWeather();
    renderWeatherStatus();
    renderCalendar();
  }

  async function fetchWeatherLocation(city) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed geocoding lookup");
    }

    const data = await response.json();
    const result = data?.results?.[0];
    if (!result) {
      throw new Error("City not found");
    }

    const region = [result.name, result.admin1, result.country].filter(Boolean).join(", ");
    return {
      latitude: result.latitude,
      longitude: result.longitude,
      timezone: result.timezone || "auto",
      label: region || city
    };
  }

  async function fetchWeeklyWeather(location) {
    const weekEnd = addDays(visibleWeekStart, 6);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&timezone=${encodeURIComponent(location.timezone || "auto")}&daily=weather_code,temperature_2m_max,temperature_2m_min&start_date=${formatDateKey(visibleWeekStart)}&end_date=${formatDateKey(weekEnd)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed forecast lookup");
    }

    const data = await response.json();
    const daily = data?.daily;
    if (!daily?.time?.length) {
      throw new Error("No forecast data");
    }

    return daily.time.reduce((accumulator, dateKey, index) => {
      accumulator[dateKey] = {
        weatherCode: daily.weather_code?.[index],
        maxTemp: daily.temperature_2m_max?.[index],
        minTemp: daily.temperature_2m_min?.[index]
      };
      return accumulator;
    }, {});
  }

  function getWeatherIconMarkup(type) {
    const icons = {
      sunny: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4.2" fill="currentColor"></circle>
          <g stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
            <line x1="12" y1="2.5" x2="12" y2="5.1"></line>
            <line x1="12" y1="18.9" x2="12" y2="21.5"></line>
            <line x1="2.5" y1="12" x2="5.1" y2="12"></line>
            <line x1="18.9" y1="12" x2="21.5" y2="12"></line>
            <line x1="5.3" y1="5.3" x2="7.2" y2="7.2"></line>
            <line x1="16.8" y1="16.8" x2="18.7" y2="18.7"></line>
            <line x1="16.8" y1="7.2" x2="18.7" y2="5.3"></line>
            <line x1="5.3" y1="18.7" x2="7.2" y2="16.8"></line>
          </g>
        </svg>
      `,
      mostlyClear: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="9" cy="9" r="4" fill="currentColor"></circle>
          <g stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity="0.95">
            <line x1="9" y1="2.5" x2="9" y2="4.6"></line>
            <line x1="9" y1="13.4" x2="9" y2="15.5"></line>
            <line x1="2.5" y1="9" x2="4.6" y2="9"></line>
            <line x1="13.4" y1="9" x2="15.5" y2="9"></line>
          </g>
          <path d="M9.5 18.2h7.3a3.2 3.2 0 0 0 .1-6.4 4.3 4.3 0 0 0-8.2-1.1 2.8 2.8 0 0 0 .8 5.5Z" fill="currentColor" opacity="0.38"></path>
        </svg>
      `,
      partlyCloudy: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="8" cy="8.5" r="3.4" fill="currentColor" opacity="0.9"></circle>
          <path d="M8.5 18h8.5a3.5 3.5 0 0 0 .1-7 4.8 4.8 0 0 0-9.1-1.2A3.1 3.1 0 0 0 8.5 18Z" fill="currentColor"></path>
        </svg>
      `,
      cloudy: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7.4 18h10a4 4 0 0 0 .2-8 5.2 5.2 0 0 0-9.9-1.4A3.6 3.6 0 0 0 7.4 18Z" fill="currentColor"></path>
        </svg>
      `,
      fog: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7.8 13.6h8.8a3.4 3.4 0 0 0 .1-6.8 4.4 4.4 0 0 0-8.5-1.1 3 3 0 0 0-.4 7.9Z" fill="currentColor"></path>
          <g stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.72">
            <line x1="4.5" y1="16.8" x2="19.5" y2="16.8"></line>
            <line x1="6.5" y1="19.5" x2="17.5" y2="19.5"></line>
          </g>
        </svg>
      `,
      drizzle: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7.4 13.6h9a3.5 3.5 0 0 0 .2-7 4.5 4.5 0 0 0-8.6-1.1 3.1 3.1 0 0 0-.6 8.1Z" fill="currentColor"></path>
          <g stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity="0.85">
            <line x1="9" y1="16.5" x2="8" y2="18.7"></line>
            <line x1="13" y1="16.5" x2="12" y2="18.7"></line>
            <line x1="17" y1="16.5" x2="16" y2="18.7"></line>
          </g>
        </svg>
      `,
      rain: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7.2 13.2h9.4a3.7 3.7 0 0 0 .2-7.3 4.8 4.8 0 0 0-9.2-1.2 3.2 3.2 0 0 0-.4 8.5Z" fill="currentColor"></path>
          <g stroke="currentColor" stroke-width="1.9" stroke-linecap="round">
            <line x1="8.8" y1="15.7" x2="7.6" y2="19.2"></line>
            <line x1="12.8" y1="15.7" x2="11.6" y2="19.6"></line>
            <line x1="16.8" y1="15.7" x2="15.6" y2="19.2"></line>
          </g>
        </svg>
      `,
      snow: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7.2 13.2h9.4a3.7 3.7 0 0 0 .2-7.3 4.8 4.8 0 0 0-9.2-1.2 3.2 3.2 0 0 0-.4 8.5Z" fill="currentColor"></path>
          <g stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
            <line x1="9" y1="16.5" x2="9" y2="19.5"></line>
            <line x1="7.6" y1="18" x2="10.4" y2="18"></line>
            <line x1="8" y1="17" x2="10" y2="19"></line>
            <line x1="10" y1="17" x2="8" y2="19"></line>
            <line x1="15" y1="16.5" x2="15" y2="19.5"></line>
            <line x1="13.6" y1="18" x2="16.4" y2="18"></line>
            <line x1="14" y1="17" x2="16" y2="19"></line>
            <line x1="16" y1="17" x2="14" y2="19"></line>
          </g>
        </svg>
      `,
      storm: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7.2 13h9.5a3.7 3.7 0 0 0 .1-7.4 4.8 4.8 0 0 0-9.2-1.1A3.2 3.2 0 0 0 7.2 13Z" fill="currentColor"></path>
          <path d="M11 14.3h3l-1.4 2.9h2.1L11.9 22l.9-3h-2.1Z" fill="currentColor"></path>
        </svg>
      `,
      neutral: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="3.2" fill="currentColor"></circle>
        </svg>
      `
    };

    return icons[type] || icons.neutral;
  }

  function getWeatherVisual(code) {
    if ([0].includes(code)) return { icon: getWeatherIconMarkup("sunny"), className: "is-sunny" };
    if ([1].includes(code)) return { icon: getWeatherIconMarkup("mostlyClear"), className: "is-mostly-clear" };
    if ([2].includes(code)) return { icon: getWeatherIconMarkup("partlyCloudy"), className: "is-partly-cloudy" };
    if ([3].includes(code)) return { icon: getWeatherIconMarkup("cloudy"), className: "is-cloudy" };
    if ([45, 48].includes(code)) return { icon: getWeatherIconMarkup("fog"), className: "is-fog" };
    if ([51, 53, 55, 56, 57].includes(code)) return { icon: getWeatherIconMarkup("drizzle"), className: "is-drizzle" };
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { icon: getWeatherIconMarkup("rain"), className: "is-rain" };
    if ([71, 73, 75, 77, 85, 86].includes(code)) return { icon: getWeatherIconMarkup("snow"), className: "is-snow" };
    if ([95, 96, 99].includes(code)) return { icon: getWeatherIconMarkup("storm"), className: "is-storm" };
    return { icon: getWeatherIconMarkup("neutral"), className: "is-neutral" };
  }
})();

