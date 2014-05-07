call _SYS_REPO.GRANT_SCHEMA_PRIVILEGE_ON_ACTIVATED_CONTENT('SELECT','${dbl.schema}','SYSTEM')
;
call _SYS_REPO.GRANT_SCHEMA_PRIVILEGE_ON_ACTIVATED_CONTENT('DELETE','${dbl.schema}','SYSTEM')
;
call _SYS_REPO.GRANT_SCHEMA_PRIVILEGE_ON_ACTIVATED_CONTENT('INSERT','${dbl.schema}','SYSTEM')
;
call _SYS_REPO.GRANT_SCHEMA_PRIVILEGE_ON_ACTIVATED_CONTENT('UPDATE','${dbl.schema}','SYSTEM')
;
call _SYS_REPO.GRANT_SCHEMA_PRIVILEGE_ON_ACTIVATED_CONTENT('execute','${dbl.schema}','SYSTEM')
;
DELETE FROM "${dbl.schema}"."${regi.rootPackage}.db.tables::USER_STATIC"
;
DELETE FROM "${dbl.schema}"."${regi.rootPackage}.db.tables::USER_TEMPORAL"
;
DELETE FROM "${dbl.schema}"."${regi.rootPackage}.db.tables::DIM_OFFERS"
;