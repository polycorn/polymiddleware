var aaa = 0, bbb = 1, ccc = { "aaa": aaa, "bbb": bbb };

function A(){
	aaa = 0;
	bbb = 1;
	return aaa+bbb;
}

function B(aaa, bbb){
	aaa = 0;
	bbb = 1;
	return aaa+bbb;
}

function C(ccc){
	ccc.aaa = 0;
	ccc.bbb = 1;
	return ccc.aaa+ccc.bbb;
}


A();
B(aaa, bbb);
C(ccc);
C({ "aaa": aaa, "bbb": bbb });