// src/pages/Users.tsx
import '@mantine/dates/styles.css';
import 'mantine-react-table/styles.css';
import { MantineReactTable, MRT_ColumnDef, MRT_ColumnFiltersState, MRT_SortingState, useMantineReactTable } from "mantine-react-table";
import { useContext, useEffect, useMemo, useState } from 'react';
import { baseUrl } from '../config';
import { showNotification } from '@mantine/notifications';
import { AuthContext } from '../context/AuthContext';

type User = { firstName: string; lastName: string; emailAddress: string; };

function Users() {

  // Accès au contexte, en vérifiant qu'il est bien défini
  const authContext = useContext(AuthContext);

  console.log("AuthContext in Users:", authContext);  // Vérifie si le contexte est disponible

  if (!authContext) {
    throw new Error('AuthContext is not available');
  }

  const { accessToken, refreshAccessToken } = authContext;

  const [data, setData] = useState<User[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [isRefetching, setIsRefetching] = useState(false);
  
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string | null>(null);
  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  const handleError = (message: string) => {
    showNotification({ title: 'Erreur', message, color: 'red' });
  };

  // Fonction pour charger les données des utilisateurs
  const fetchData = async () => {
    if (!accessToken) {
      console.error('No access token available');
      return;
    }

    try {
      const url = new URL(`${baseUrl}/users`);
      url.searchParams.set('start', `${pagination.pageIndex * pagination.pageSize}`);
      url.searchParams.set('size', `${pagination.pageSize}`);
      url.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
      url.searchParams.set('globalFilter', globalFilter ?? '');
      url.searchParams.set('sorting', JSON.stringify(sorting ?? []));

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken.trim()}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include', 
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.log('Token expired, trying to refresh...');
          await refreshAccessToken(); // Rafraîchir le token si expiré
          return fetchData(); // Relancer la requête avec le nouveau token
        }
        throw new Error('Erreur de chargement des utilisateurs');
      }

      const result = await response.json();
      setData(result.users); 
      setRowCount(result.totalResults);
    } catch (error) {
      setIsError(true);
      handleError('Échec du chargement des utilisateurs');
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchData();
    }
  }, [accessToken, pagination, columnFilters, globalFilter, sorting]);

  const columns = useMemo<MRT_ColumnDef<User>[]>(() => [
    { accessorKey: 'firstName', header: 'First Name' },
    { accessorKey: 'lastName', header: 'Last Name' },
    { accessorKey: 'emailAddress', header: 'Email' }
  ], []);

  const table = useMantineReactTable({
    columns,
    data,
    enableRowSelection: true,
    getRowId: (row) => row.emailAddress,
    initialState: { showColumnFilters: true },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    rowCount,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    },
    mantineToolbarAlertBannerProps: isError
      ? { color: 'red', children: 'Error loading data' }
      : undefined,
  });

  return (
    <div>
      <MantineReactTable 
        table={table}
      />
    </div>
  );
}

export default Users;