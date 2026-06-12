import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Activity, CheckCircle2, ServerCrash } from 'lucide-react';
import { apiCheckFailed, apiCheckStarted, apiCheckSucceeded } from '../app/appSlice';
import { apiClient } from '../lib/apiClient';

const statusCopy = {
  idle: 'Not checked',
  loading: 'Checking API',
  healthy: 'API healthy',
  offline: 'API offline',
};

export function HomePage() {
  const dispatch = useDispatch();
  const apiStatus = useSelector((state) => state.app.apiStatus);

  useEffect(() => {
    let isMounted = true;

    async function checkHealth() {
      dispatch(apiCheckStarted());

      try {
        await apiClient.get('/health');

        if (isMounted) {
          dispatch(apiCheckSucceeded());
        }
      } catch {
        if (isMounted) {
          dispatch(apiCheckFailed());
        }
      }
    }

    checkHealth();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  const Icon = apiStatus === 'healthy' ? CheckCircle2 : apiStatus === 'offline' ? ServerCrash : Activity;

  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <h1 className="text-3xl font-bold tracking-normal text-ink sm:text-4xl">CampusKart</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          Phase 1 establishes the production foundation for the campus marketplace. Authentication,
          listings, cart, orders, payments, and addresses will be added in their dedicated phases.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-market">
            <Icon size={22} aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Backend status</p>
            <p className="text-lg font-semibold text-ink">{statusCopy[apiStatus]}</p>
          </div>
        </div>
      </div>
    </section>
  );
}