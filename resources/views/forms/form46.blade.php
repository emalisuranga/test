<html>

<head>
    <title>FORM 46</title>
    <style>
        table,
        th,
        td {
            border: 1px solid black;
            border-collapse: collapse;
            margin-right: 0px;
            margin-left: 0px;
            margin-bottom: 0px;
            font-size: 14px;
            padding: 5px;
            font-family: sans-serif;
        }

        .bg-color {
            background: #b9b9b9;
        }
        table{
                page-break-inside: avoid;
                table-layout:fixed;
        }
        font {
            margin-left: 0px;
            margin-right: 0px;
            /* font-size: 16px; */
            font-family: sans-serif;
            margin-bottom: 1px;
        }
        @page {
	header: page-header;
	footer: page-footer;
        }
    </style>
</head>

<body>
    <section class="form-body">
        <header class="form-header">
        <table width="100%" style="border:0; padding:0;">
                <tr>
                    <td width="10%" style="border:0; padding:0px;"><img width="100px" height="100px" src="{{ URL::to('/') }}/images/govlogo.jpg" alt="gov_logo"></td>
                    <td width="60%" style="border:0; font-size: 18px; padding-top:20px; padding-left:100px " align="center"><b>FORM 46<br><br></b></td>
                    <td width="12%" style="border:0; padding:0px; font-size: 10px;" align="left">(Section 489(c))</td>
                    <td width="18%" style="border:0; padding:0px;"> <img width="130" height="auto" src="{{ URL::to('/') }}/images/eroc.png" alt="Logo EROC"></td>
                </tr>
                <tr>
                    <td colspan="4" align="center" style="border:0; font-size:16px; padding:0;"><b>LIST OF THE NAMES AND ADDRESS OF PERSONS RESIDENT IN SRI LANKA AUTHORIZED TO ACCEPT SERVICE
                                        ON BEHALF OF A COMPANY INCORPORATED OUTSIDE SRI LANKA WITH A PLACE OF BUSINESS ESTABLISHED
                                        IN SRI LANKA</b></td>
                </tr>
                <tr>
                    <td colspan="4"  style="border:0; padding:0px; font-size:13px; padding-left:230px;">The companies Act No.7 of 2007 Pursuant to Sec 489(c)
</td>
                </tr>
            </table>

            <!-- <table style="border: 0; margin-left: 0; margin-right: 0;" width="100%">
                <tbody>
                    <tr style="border: 0;">
                        <td style=" border: 0;">
                            <img src="{{ URL::to('/') }}/images/govlogo.jpg" idth="100px" height="100px" alt="" /> </td>                       
                        <td style="border: 0;" width="60%">
                            <center>
                                <font style="font-size:16px;">
                                    <b>FORM 46</b>
                                </font>
                        </td>
                        <td  style="border:0; padding:0px; font-size: 10px;" align="left">(Section 489(d))</td>
                        <td style=" border: 0;">
                            <img src="{{ URL::to('/') }}/images/eroc.png" width="130" height="auto" alt="" /></td>                        
                    </tr>
                    <tr width="80%" style="border: 0;">
                        <td colspan="3" style="border: 0;">
                            <center>
                                <font style="font-size:16px;">
                                    <b>LIST OF THE NAMES AND ADDRESS OF PERSONS RESIDENT IN SRI LANKA AUTHORIZED TO ACCEPT SERVICE
                                        ON BEHALF OF A COMPANY INCORPORATED OUTSIDE SRI LANKA WITH A PLACE OF BUSINESS ESTABLISHED
                                        IN SRI LANKA</b>
                                </font>
                                <br>
                                <font style="font-size:12px;">
                                    The companies Act No.7 of 2007 Pursuant to Sec 489(c)
                                </font>
                            </center>
                        </td>
                    </tr>
                </tbody>
            </table> -->
            <br>

            <table style="border: 0;" width="100%" height="30">
                <tbody>
                    <tr>
                        <td width="30%" height="35" style="border: 0;">Number of the Company </td>
                        <td width="7%" height="35">&nbsp;</td>
                        <td width="7%" height="35">&nbsp;</td>
                        <td width="56%" height="35">&nbsp;</td>
                    </tr>
                </tbody>
            </table>
            <br>

            <table width="100%" height="30">
                <tbody>
                    <tr height="20">
                        <td width="28%" class="bg-color">Name of the Company </td>
                        <td width="72%"><?php echo ($company_info->name) ? $company_info->name.' '.$postfix : '' ?></td>
                    </tr>
                    <tr height="20">
                        <td width="28%" class="bg-color">Registered or Principal Office Address(country in which it is Incorporated)</td>
                        <td width="72%">

                        <?php  echo $company_for_address->address1.',<br/>'; ?>
                        <?php echo ($company_for_address->address2) ? $company_for_address->address2.',<br/>' : ''; ?>
                        <?php  echo $company_for_address->city.',<br/>'; ?>
                        <?php  echo $company_for_address->province.',<br/>'; ?>
                         <?php  echo $company_for_address->country; ?>
                        </td>
                    </tr>
                    <tr height="20">
                        <td width="28%" class="bg-color">Principal Place of Business in Sri Lanka</td>
                        <td width="72%">
                         <?php // echo $company_address->address1.','; ?>
                        <?php // echo ($company_address->address2) ? $company_address->address2.',' : ''; ?>
                        <?php  // echo $company_address->city.','; ?>
                        <?php //  echo $company_address->postcode; ?>

                         <?php  echo $company_address->address1.',<br/>'; ?>
                        <?php echo ($company_address->address2) ? $company_address->address2.',<br/>' : ''; ?>
                        <?php  // echo $company_address->city.',<br/>'; ?>
                        <?php  echo '<strong>postcode: </strong>'.$company_address->postcode; ?>
                    
                    </td>
                    </tr>
                </tbody>
            </table>
            <br>
            

              <?php 
               if( count($secs) ) {
              foreach($secs as $d ){
                  
                  $dc++; ?>
            <table width="100%" height="30">
                <tbody>
                    <tr height="20">
                        <td width="28%" class="bg-color">Full Name </td>
                        <td width="72%"><?php echo ( $d['firstname'].' '.$d['lastname'] );?></td>
                    </tr>
                    <tr height="20">
                        <td width="28%" class="bg-color">Passport No. (Indicate the Country of Issue)</td>
                        <td width="72%"><?php
                        if($d['type'] != 'local'){
                           echo   $d['passport'].','.$d['passport_issued_country'];
                           // echo '<br/>';
                           // echo 'Country: '. $d['country'];
                    }else{
                          // echo  $d['nic'];  
                           echo 'NIC: '. $d['nic'];
                    }
                        
                        ?></td>
                    </tr>
                    <tr height="20">
                        <td width="28%" class="bg-color">Residential Address</td>
                        <td width="72%">
                        <?php
                      //  print_r($d);
 
                        if($d['type'] == 'local'){ ?>

                                <p style="text-decoration:underline;font-weight:bold">Local Address</p>

                                <?php  echo $d['localAddress1'].',<br/>'; ?>
                                <?php echo ($d['localAddress2']) ? $d['localAddress2'].',<br/>' : ''; ?>
                                <?php // echo $d['city'].',<br/>'; ?>
                                <?php  // echo $d['district'].','; ?>
                                <?php  // echo $d['province'].','; ?>
                                <?php echo '<strong>postcode: </strong>'.$d['postcode']; ?>

                                 <?php 
                                    if( $d['forProvince'] &&  $d['forCity'] && $d['forAddress1'] && $d['forPostcode'] && $d['country'] ) { ?>

                                         <p style="text-decoration:underline;font-weight:bold"><br/>Foreign Address</p>

                                         <?php  echo $d['forAddress1'].',<br/>'; ?>
                                         <?php echo ($d['forAddress2']) ? $d['forAddress2'].',<br/>' : ''; ?>
                                         <?php  echo $d['forCity'].',<br/>'; ?>
                                         <?php  echo $d['forProvince'].',<br/>'; ?>
                                         <?php echo '<strong>zipcode: </strong>'.$d['forPostcode'].',<br/>'; ?>
                                         <?php  echo $d['country'].',<br/>'; ?>
                                    <?php

                                    }

                                 ?>

                                <?php }else { ?>

                                <p style="text-decoration:underline;font-weight:bold">Foreign Address</p>

                                    <?php  echo $d['forAddress1'].',<br/>'; ?>
                                    <?php echo ($d['forAddress2']) ? $d['forAddress2'].',<br/>' : ''; ?>
                                    <?php  echo $d['forCity'].',<br/>'; ?>
                                    <?php  echo $d['forProvince'].',<br/>'; ?>
                                    <?php echo '<strong>zipcode: </strong>'.$d['forPostcode'].',<br/>'; ?>
                                    <?php  echo $d['country'].',<br/>'; ?>


                                 <?php
                                 if(  $d['localAddress1'] && $d['localAddress2'] && $d['postcode']) { ?>

                                    <p style="text-decoration:underline;font-weight:bold"><br/>Local Address</p>

                                    <?php  echo $d['localAddress1'].',<br/>'; ?>
                                    <?php echo ($d['localAddress2']) ? $d['localAddress2'].',<br/>' : ''; ?>
                                    <?php echo '<strong>postcode: </strong>'.$d['postcode']; ?>


                                  <?php } ?>



                               

                                <?php } ?>



                        </td>
                    </tr>
                    <tr height="20">
                        <td width="28%" class="bg-color">Other Business or Occupation/Directorships if Any </td>
                        <td width="72%"><?php echo $d['occupation'];?></td>
                    </tr>
                </tbody>
            </table>
            <?php }
            
                                }?>


              <?php 
               if( count($secFirms) ) {
              foreach($secFirms as $d ){

           
                  $dc++; ?>
            <table width="100%" height="30">
                <tbody>
                    <tr height="20">
                        <td width="28%" class="bg-color">Full Name </td>
                        <td width="72%"><?php echo ( $d['title'] );?></td>
                    </tr>
                    <tr height="20">
                        <td width="28%" class="bg-color">Passport No. (indicate the Country of Issue)</td>
                        <td width="72%">
                        
                        
                        </td>
                    </tr>
                    <tr height="20">
                        <td width="28%" class="bg-color">Residential Address</td>
                        <td width="72%">
                        <?php if($d['type'] == 'local'){ ?>

                                <?php // echo $d['localAddress1'].','; ?>
                                <?php //echo ($d['localAddress2']) ? $d['localAddress2'].',' : ''; ?>
                                <?php // echo $d['city'].','; ?>
                                <?php // echo $d['district'].','; ?>
                                <?php // echo $d['province'].','; ?>
                                <?php //  echo $d['postcode']; ?>

                                <?php  echo $d['localAddress1'].',<br/>'; ?>
                                <?php echo ($d['localAddress2']) ? $d['localAddress2'].',<br/>' : ''; ?>
                                <?php  // echo $d['city'].',<br/>'; ?>
                                <?php  // echo $d['district'].','; ?>
                                <?php  // echo $d['province'].','; ?>
                                <?php echo '<strong>postcode: </strong>'.$d['postcode']; ?>

                                <?php }else { ?>

                                <?php // echo $d['localAddress1'].','; ?>
                                <?php // echo ($d['localAddress2']) ? $d['localAddress2'].',' : ''; ?>
                                <?php // echo $d['city'].','; ?>
                                <?php // echo $d['province'].','; ?>
                                <?php  //echo $d['postcode'].','; ?>
                                <?php // echo $d['country']; ?>

                                 <?php  echo $d['localAddress1'].',<br/>'; ?>
                                <?php echo ($d['localAddress2']) ? $d['localAddress2'].',<br/>' : ''; ?>
                                <?php  echo $d['city'].',<br/>'; ?>
                                <?php  echo $d['province'].',<br/>'; ?>
                                <?php echo '<strong>postcode: </strong>'.$d['postcode']; ?>

                                <?php } ?>



                        </td>
                    </tr>
                    <tr height="20">
                        <td width="28%" class="bg-color">Other Business or Occupation/Directorships if Any </td>
                        <td width="72%"><?php echo $d['occupation'];?></td>
                    </tr>
                </tbody>
            </table>
            <?php }
            
                                }?>
            <br>

            <table width="100%">
                <tbody>
                   <?php  
                   if(count($secs)) {
                   foreach($secs as $d ){ $dc++; ?>
                    <tr >
                        <td width="28%" height="80" class="bg-color">Full Name of Authorised Person</td>
                        <td width="72%" height="80"><?php echo ( $d['firstname'].' '.$d['lastname'] );?></td>
                    </tr>
                    <tr >
                        <td width="28%" height="50" class="bg-color">Signature of Authorised Person</td>
                        <td width="72%" height="50">&nbsp;</td>
                    </tr>
                  <?php } } ?>
                  <?php  
                   if(count($secFirms)) {
                  foreach($secFirms as $d ){ $dc++; ?>
                    <tr >
                        <td width="28%" height="80" class="bg-color">Full Name of Authorised Person</td>
                        <td width="72%" height="80"><?php echo ( $d['title'] );?></td>
                    </tr>
                    <tr >
                        <td width="28%" height="50" class="bg-color">Signature of Authorised Person</td>
                        <td width="72%" height="50">&nbsp;</td>
                    </tr>
                  <?php } }?>
                </tbody>
            </table>
            <br>

            <table style="border: 0" width="100%" height="50.4">
                <tbody>
                <tr>

                    <?php
                        $payment_time_stamp = ($payment_date) ? $payment_date : time();
                        $d = date('d', $payment_time_stamp);
                        $m = date('m', $payment_time_stamp);
                        $y = date('Y', $payment_time_stamp);

                        ?>
                    <td height="22" align="right" style="border: 0">Date:</td>
                    <td style="border: 0"></td>
                    <td  width="6%" align="center"><?php echo $d[0];?></td>
                    <td  width="6%" align="center"><?php echo $d[1];?></td>
                    <td style="border: 0"></td>
                    <td  width="6%" align="center"><?php echo $m[0];?></td>
                    <td  width="6%" align="center"><?php echo $m[1];?></td>
                    <td style="border: 0"></td>
                    <td  width="6%" align="center"><?php echo $y[0];?></td>
                    <td  width="6%" align="center"><?php echo $y[1];?></td>
                    <td  width="6%" align="center"><?php echo $y[2];?></td>
                    <td  width="6%" align="center"><?php echo $y[3];?></td>
                    </tr>
                    <tr>
                    <tr>
                        <td width="24%" height="22" style="border: 0"></td>
                        <td width="6%" style="border: 0"> </td>
                        <td colspan="2" bgcolor="#b9b9b9">
                            <center>Day</center></td>                        
                        <td width="6%" style="border: 0"></td>
                        <td colspan="2" bgcolor="#b9b9b9">
                            <center>Month</center></td>                        
                        <td width="6%" style="border: 0"></td>
                        <td colspan="4" bgcolor="#b9b9b9">
                            <center>Year</center></td>                        
                    </tr>
                </tbody>
            </table>

            <table width="100%" autosize="1">
                <tbody>
                <tr  height="20">
                    <td colspan="2" style=" border:1px solid #000;border-top:1px solid #fff; border-right:1px solid #fff; border-left:1px solid #fff; word-break: break-all; font-size: 14px;"> <strong><font ><b>Presented by:</b></font></strong></td>
                </tr>
                <tr height="20">
                                <td width="28%" >Full Name </td>
                                <td width="72%"><?php echo $loginUser->first_name; ?> <?php echo $loginUser->last_name; ?></td>
                        </tr>
                        <tr height="20">
                                <td width="28%">Email Address</td>
                                <td width="72%"><?php echo $loginUser->email; ?></td>
                        </tr> 
                        <tr  height="20">
                                <td width="28%">Telephone No.</td>
                                <td width="72%"><?php echo $loginUser->telephone; ?></td>
                        </tr> 
                <tr  height="20">
                                <td width="28%" >Mobile No.</td>
                                <td width="72%"><?php echo $loginUser->mobile; ?></td>
                        </tr > 
                        <tr  height="40">
                                <td width="28%" >Address</td>
                                <td width="72%">

                                <?php  echo $loginUserAddress->address1.',<br/>'; ?>
                                <?php  echo ( $loginUserAddress->address2 ) ? $loginUserAddress->address2.',<br/>' : ''; ?>
                                <?php  // echo $loginUserAddress->city.',<br/>'; ?>
                                <?php  echo '<strong>postcode: </strong>'.$loginUserAddress->postcode; ?>

                                </td>
                        </tr>
                </tbody>
            </table>

            <htmlpagefooter name="page-footer" >
	<div class="page-no" style="text-align:right" >{PAGENO}</div>
        </htmlpagefooter>

</body>

</html>