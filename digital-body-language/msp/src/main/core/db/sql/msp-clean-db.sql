call _SYS_REPO.GRANT_SCHEMA_PRIVILEGE_ON_ACTIVATED_CONTENT('SELECT','${msp.schema}','SYSTEM')
;
call _SYS_REPO.GRANT_SCHEMA_PRIVILEGE_ON_ACTIVATED_CONTENT('DELETE','${msp.schema}','SYSTEM')
;
call _SYS_REPO.GRANT_SCHEMA_PRIVILEGE_ON_ACTIVATED_CONTENT('INSERT','${msp.schema}','SYSTEM')
;
call _SYS_REPO.GRANT_SCHEMA_PRIVILEGE_ON_ACTIVATED_CONTENT('UPDATE','${msp.schema}','SYSTEM')
;
call _SYS_REPO.GRANT_SCHEMA_PRIVILEGE_ON_ACTIVATED_CONTENT('execute','${msp.schema}','SYSTEM')
;
DELETE FROM "${msp.schema}"."INDIVIDUAL"
;